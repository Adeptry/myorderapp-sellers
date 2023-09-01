import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectUnauthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useCurrentMerchantQuery({
    retry: false,
    params: {
      appConfig: true, // this enables us to use the cached appConfig if it exists
    },
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(routes.login);
    }
  }, [authStatus, data, queryStatus]);
};
