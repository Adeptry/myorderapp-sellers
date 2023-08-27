import { useSession } from "next-auth/react";
import { configurationForSession } from "./configurationForSession";

export const useSessionedApiConfiguration = () => {
  const { data, status } = useSession();

  return {
    configuration: configurationForSession(data),
    status,
  };
};
