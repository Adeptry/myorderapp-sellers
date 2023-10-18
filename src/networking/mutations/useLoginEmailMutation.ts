import { useMutation } from "@tanstack/react-query";
import { AuthenticationEmailLoginRequestBody } from "myorderapp-square";
import { signIn } from "next-auth/react";

export const useLoginEmailMutation = (props: { callbackUrl: string }) => {
  return useMutation({
    mutationFn: async (
      authEmailLoginDto: AuthenticationEmailLoginRequestBody
    ) => {
      return await signIn("credentials", {
        ...authEmailLoginDto,
        callbackUrl: props.callbackUrl,
        redirect: false,
      });
    },
  });
};
