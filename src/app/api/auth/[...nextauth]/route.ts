import { moaEnv } from "@/utils/moaEnv";
import {
  AuthenticationApi,
  AuthRegisterLoginDto,
  Configuration,
} from "moa-merchants-ts-axios";
import ms from "ms";
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
          const response = await new AuthenticationApi(
            new Configuration({
              apiKey: moaEnv.backendApiKey,
              basePath: moaEnv.backendUrl,
              accessToken: params.token.refreshToken,
            })
          ).postRefresh();
          const data = response.data;
          if (data) {
            params.token.token = data.token;
            params.token.refreshToken = data.refreshToken;
            params.token.tokenExpires = data.tokenExpires;
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (e) {
          throw new Error("Token refresh failed");
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
            authEmailLoginDto: credentials as AuthRegisterLoginDto,
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
