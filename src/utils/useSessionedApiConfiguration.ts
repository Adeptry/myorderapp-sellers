import { useSession } from "next-auth/react";
import { configurationForSession } from "./configurationForSession";

export const useSessionedApiConfiguration = () => {
  const { data } = useSession();
  return configurationForSession(data);
};
