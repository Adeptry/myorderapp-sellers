import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectUnauthenticatedSessions } from "./useRedirectUnauthenticatedSessions";

export const useRedirectNotSetupSessions = () => {
  useRedirectUnauthenticatedSessions();

  const { push } = useRouter();
  const { status: authenticationStatus } = useSession();
  const { data: merchantMe, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (queryStatus === "success") {
      if (merchantMe.appConfig == undefined) {
        push(routes.setup.theme);
      } else if (merchantMe.squareId == undefined) {
        push(routes.setup.square.index);
      } else if (merchantMe.catalog?.id == undefined) {
        push(routes.setup.catalog);
      } else if (merchantMe.tier == undefined) {
        push(routes.setup.plan);
      }
    }
  }, [authenticationStatus, merchantMe, queryStatus]);
};
