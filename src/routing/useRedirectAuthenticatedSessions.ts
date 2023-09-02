import { routes } from "@/app/routes";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirectAuthenticatedSessions = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const { data, status: queryStatus } = useCurrentMerchantQuery({
    retry: false,
  });

  useEffect(() => {
    if (authStatus === "authenticated") {
      router.push(routes.home);
    }
  }, [authStatus, data, queryStatus]);

  return authStatus;
};
