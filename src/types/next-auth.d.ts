import "next-auth";

declare module "next-auth" {
  interface User {
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }

  interface Session {
    user: {
      token: string;
      refreshToken: string;
      tokenExpires: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }
}
