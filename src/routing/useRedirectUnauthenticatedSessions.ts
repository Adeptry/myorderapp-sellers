import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useGetUserMeQuery } from "@/networking/queries/useGetUserMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectEnvironmentFlags } from "./useRedirectEnvironmentFlags";

export const useRedirectUnauthenticatedSessions = () => {
  useRedirectEnvironmentFlags();
  const router = useRouter();
  const { status: authenticationStatus } = useSession();
  const { data: merchantMeData, status: merchantMeStatus } =
    useGetMerchantMeQuery();

  const { data: userMeData } = useGetUserMeQuery({
    merchants: true,
  });

  useEffect(() => {
    if (
      authenticationStatus === "unauthenticated" &&
      merchantMeStatus === "error"
    ) {
      router.push(routes.login);
    } else if (
      authenticationStatus === "authenticated" &&
      userMeData != undefined
    ) {
      () => {};
    }
  }, [authenticationStatus, merchantMeData, merchantMeStatus]);

  return authenticationStatus;
};
