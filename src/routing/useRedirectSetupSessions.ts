import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRedirectUnauthenticatedSessions } from "./useRedirectUnauthenticatedSessions";

export const useRedirectSetupSessions = () => {
  useRedirectUnauthenticatedSessions();

  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useCurrentMerchantQuery();

  useEffect(() => {
    if (queryStatus === "success") {
      if (data.appConfig == undefined) {
        router.push(routes.setup.theme);
      } else if (data.squareId == undefined) {
        router.push(routes.setup.square.index);
      } else if (data.catalog?.id == undefined) {
        router.push(routes.setup.catalog);
      } else if (data.tier == undefined) {
        router.push(routes.setup.tier);
      }
    }
  }, [authStatus, data, queryStatus]);
};
