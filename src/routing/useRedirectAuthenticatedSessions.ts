import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export const useRedirectAuthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useGetMerchantMeQuery();

  if (moaEnv.comingSoon) {
    router.push(routes.comingSoon);
  } else if (moaEnv.maintenance) {
    router.push(routes.maintenance);
  }

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.push(routes.dashboard);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
