import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectUnauthenticatedSessions } from "./useRedirectUnauthenticatedSessions";

export const useRedirectSetupSessions = (to: string) => {
  useRedirectUnauthenticatedSessions();

  const { push } = useRouter();
  const { status: authenticationStatus } = useSession();
  const { data: merchantMe, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (queryStatus === "success") {
      if (merchantMe.tier != undefined) {
        push(to);
      }
    }
  }, [authenticationStatus, merchantMe, queryStatus]);
};
