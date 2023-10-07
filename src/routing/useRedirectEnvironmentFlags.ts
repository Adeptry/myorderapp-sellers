import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";

export const useRedirectEnvironmentFlags = () => {
  const { push } = useRouter();

  useEffect(() => {
    if (moaEnv.comingSoon) {
      push(routes.comingSoon);
    } else if (moaEnv.maintenance) {
      push(routes.maintenance);
    }
  }, []);
};
