import { useSessionedApiConfiguration } from "@/utils/useSessionedApiConfiguration";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UsersApi, UsersApiGetUserMeRequest } from "myorderapp-square";
import { useSession } from "next-auth/react";

export const useGetUserMeQuery = (params: UsersApiGetUserMeRequest) => {
  const GetUserMeQueryKey = "getUserMe";

  const {
    status: authStatus,
    update: updateAuth,
    data: session,
  } = useSession();
  const sessionedApiConfiguration = useSessionedApiConfiguration();

  return useQuery({
    queryKey: [GetUserMeQueryKey, params],
    queryFn: async () => {
      return (await new UsersApi(sessionedApiConfiguration).getUserMe(params))
        .data;
    },
    enabled: authStatus === "authenticated",
    retry: (failureCount, error: AxiosError) => {
      if (error?.response?.status === 401 && session !== null) {
        updateAuth();
        return failureCount < 3;
      }
      return false;
    },
  });
};
