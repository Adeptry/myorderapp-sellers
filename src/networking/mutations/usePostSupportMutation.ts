import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import { UsersApi, UsersApiPostSupportRequest } from "myorderapp-square";

export const usePostSupportMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (requestParameters: UsersApiPostSupportRequest) => {
      return await new UsersApi(sessionedApiConfiguration).postSupport(
        requestParameters
      );
    },
  });
};
