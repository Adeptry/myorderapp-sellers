import { moaEnv } from "@/utils/moaEnv";
import {
  AuthApiFp,
  AuthRegisterLoginDto,
  Configuration,
} from "moa-merchants-ts-axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 1 day
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
          const response = await (
            await AuthApiFp(
              new Configuration({
                apiKey: moaEnv.backendApiKey,
                basePath: moaEnv.backendUrl,
              })
            ).createSession(credentials as AuthRegisterLoginDto)
          )();
          const data = response.data;
          if (data) {
            const returnedData = {
              id: data.user.id,
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
