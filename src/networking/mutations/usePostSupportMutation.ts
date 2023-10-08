import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useMutation } from "@tanstack/react-query";
import { MailApi, MailApiPostSupportRequest } from "myorderapp-square";

export const usePostSupportMutation = () => {
  const sessionedApiConfiguration = useSessionedApiConfiguration();
  return useMutation({
    mutationFn: async (requestParameters: MailApiPostSupportRequest) => {
      return await new MailApi(sessionedApiConfiguration).postSupport(
        requestParameters
      );
    },
  });
};
