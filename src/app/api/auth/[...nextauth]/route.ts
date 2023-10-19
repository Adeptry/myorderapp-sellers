import { moaEnv } from "@/moaEnv";
import axios from "axios";
import ms from "ms";
import {
  AuthenticationApi,
  Configuration,
  MerchantsApi,
} from "myorderapp-square";
import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  debug: process.env.NEXT_AUTH_DEBUG === "true",
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
    async redirect(params: { url: string; baseUrl: string }) {
      const { url, baseUrl } = params;
      return url;
    },
    async jwt(params) {
      const { user, token, account } = params;

      if (account && user) {
        const loginAuthApi = new AuthenticationApi(
          new Configuration({
            apiKey: moaEnv.backendApiKey,
            basePath: moaEnv.backendUrl,
          })
        );
        if (account.provider === "google") {
          if (account.id_token) {
            const postLoginGoogleResponse = await loginAuthApi.postLoginGoogle({
              authGoogleLoginDto: {
                idToken: account.id_token,
              },
            });
            token.token = postLoginGoogleResponse.data.token;
            token.refreshToken = postLoginGoogleResponse.data.refreshToken;
            token.tokenExpires = postLoginGoogleResponse.data.tokenExpires;

            const merchantsApi = new MerchantsApi(
              new Configuration({
                apiKey: moaEnv.backendApiKey,
                basePath: moaEnv.backendUrl,
                accessToken: postLoginGoogleResponse.data.token,
              })
            );

            try {
              await merchantsApi.getMerchantMe();
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                await merchantsApi.postMerchantMe();
              }
            }
          } else {
            throw new Error("Invalid id_token");
          }
        } else if (account.provider === "apple") {
          if (account.id_token) {
            const postLoginGoogleResponse = await loginAuthApi.postLoginApple({
              authAppleLoginDto: {
                idToken: account.id_token,
              },
            });
            token.token = postLoginGoogleResponse.data.token;
            token.refreshToken = postLoginGoogleResponse.data.refreshToken;
            token.tokenExpires = postLoginGoogleResponse.data.tokenExpires;

            const merchantsApi = new MerchantsApi(
              new Configuration({
                apiKey: moaEnv.backendApiKey,
                basePath: moaEnv.backendUrl,
                accessToken: postLoginGoogleResponse.data.token,
              })
            );

            try {
              await merchantsApi.getMerchantMe();
            } catch (error) {
              if (axios.isAxiosError(error) && error.response?.status === 404) {
                await merchantsApi.postMerchantMe();
              } else {
                throw error;
              }
            }
          } else {
            throw new Error("Invalid id_token");
          }
        } else {
          throw new Error("Invalid provider");
        }
      } else if (user) {
        token.token = user.token;
        token.refreshToken = user.refreshToken;
        token.tokenExpires = user.tokenExpires;
      }

      if (
        (token.tokenExpires && new Date().getTime() > token.tokenExpires) ||
        params.trigger === "update"
      ) {
        try {
          const refreshApi = new AuthenticationApi(
            new Configuration({
              apiKey: moaEnv.backendApiKey,
              basePath: moaEnv.backendUrl,
              accessToken: token.refreshToken,
            })
          );
          const response = await refreshApi.postRefresh();
          const data = response.data;
          if (data) {
            token.token = data.token;
            token.refreshToken = data.refreshToken;
            token.tokenExpires = data.tokenExpires;
          } else {
            throw new Error("Token refresh failed because no data");
          }
        } catch (e) {
          console.error(JSON.stringify(e, null, 2));
          throw new Error("Token refresh failed", { cause: e });
        }
      }

      return token;
    },
  },
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const api = new AuthenticationApi(
            new Configuration({
              apiKey: moaEnv.backendApiKey,
              basePath: moaEnv.backendUrl,
            })
          );

          const response = await api.postEmailLogin({
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
