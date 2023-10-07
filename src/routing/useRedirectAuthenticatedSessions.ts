import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectEnvironmentFlags } from "./useRedirectEnvironmentFlags";

export const useRedirectAuthenticatedSessions = () => {
  useRedirectEnvironmentFlags();
  const { push } = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (authStatus === "authenticated") {
      push(routes.dashboard);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
