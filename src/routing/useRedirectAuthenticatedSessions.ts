import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export const useRedirectAuthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.push(routes.dashboard);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
