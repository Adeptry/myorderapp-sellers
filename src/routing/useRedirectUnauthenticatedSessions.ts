import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectUnauthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useCurrentMerchantQuery();

  useEffect(() => {
    if (authStatus === "unauthenticated" && queryStatus === "error") {
      router.push(routes.login);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
