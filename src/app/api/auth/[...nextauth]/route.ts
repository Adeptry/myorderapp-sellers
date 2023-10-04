import { moaEnv } from "@/utils/moaEnv";
import ms from "ms";
import {
  AuthenticationApi,
  Configuration,
  ConfigurationParameters,
} from "myorderapp-square";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN!) / 1000,
    updateAge: ms(process.env.AUTH_JWT_TOKEN_EXPIRES_IN!) / 1000,
  },
  callbacks: {
    async session(params) {
      params.session.user.token = params.token.token;
      params.session.user.refreshToken = params.token.refreshToken;
      params.session.user.tokenExpires = params.token.tokenExpires;
      return params.session;
    },
    async jwt(params) {
      if (params.user) {
        params.token.token = params.user.token;
        params.token.refreshToken = params.user.refreshToken;
        params.token.tokenExpires = params.user.tokenExpires;
      }

      if (
        (params.token.tokenExpires &&
          new Date().getTime() > params.token.tokenExpires) ||
        params.trigger === "update"
      ) {
        try {
          const parameters: ConfigurationParameters = {
            apiKey: moaEnv.backendApiKey,
            basePath: moaEnv.backendUrl,
            accessToken: params.token.refreshToken,
          };
          console.log(JSON.stringify(parameters, null, 2));
          const response = await new AuthenticationApi(
            new Configuration(parameters)
          ).postRefresh();
          const data = response.data;
          if (data) {
            params.token.token = data.token;
            params.token.refreshToken = data.refreshToken;
            params.token.tokenExpires = data.tokenExpires;
          } else {
            throw new Error("Token refresh failed because no data");
          }
        } catch (e) {
          console.error(JSON.stringify(e, null, 2));
          throw new Error("Token refresh failed", { cause: e });
        }
      }

      return params.token;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const response = await new AuthenticationApi(
            new Configuration({
              apiKey: moaEnv.backendApiKey,
              basePath: moaEnv.backendUrl,
            })
          ).postEmailLogin({
            authenticationEmailLoginRequestBody: {
              email: credentials?.email ?? "",
              password: credentials?.password ?? "",
            },
          });
          const data = response.data;
          if (data.user?.id) {
            const returnedData = {
              id: data.user?.id,
              token: data.token,
              refreshToken: data.refreshToken,
              tokenExpires: data.tokenExpires,
            };
            return returnedData;
          } else {
            throw new Error("Authentication failed");
          }
        } catch (e) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
