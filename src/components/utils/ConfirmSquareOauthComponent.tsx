import { routes } from "@/app/routes";
import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MerchantsApi } from "moa-merchants-ts-axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmSquareOauthComponent() {
  const searchParams = useSearchParams();
  const oauthAccessCode = searchParams.get("code");
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  const common = useTranslations("Common");
  const { status } = useSession();
  const { push } = useRouter();

  const postSquareOauthMutationMe = useMutation({
    mutationFn: async (oauthAccessCode: string) => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).postSquareOauthMe({
        squareConfirmOauthDto: {
          oauthAccessCode,
        },
      });
    },
  });

  const squareSyncMutation = useMutation({
    mutationFn: async () => {
      return await new MerchantsApi(
        sessionedApiConfiguration
      ).getSquareSyncMe();
    },
  });

  const [errorString, setErrorString] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      if (oauthAccessCode && status === "authenticated") {
        try {
          await postSquareOauthMutationMe.mutateAsync(oauthAccessCode);
          await squareSyncMutation.mutateAsync();
          push(routes.setup.catalog);
        } catch (error) {
          if (axios.isAxiosError(error) && error?.response?.status === 422) {
            const message = (error?.response?.data as any).message;
            if (typeof message === "string") {
              setErrorString(message);
            } else {
              setErrorString(common("error"));
            }
          } else {
            setErrorString(common("error"));
          }
        }
      }
    }

    fetch();
  }, [oauthAccessCode, status]);

  return (
    <Box>
      {errorString && <Alert severity="error">{errorString}</Alert>}
      {!errorString && (
        <Box
          flexGrow={1}
          display={"flex"}
          sx={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
