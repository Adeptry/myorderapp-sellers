import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export const useRedirectUnauthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (authStatus === "unauthenticated" && queryStatus === "error") {
      router.push(routes.login);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
