/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { routes } from "@/app/routes";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { useGetUserMeQuery } from "@/networking/queries/useGetUserMeQuery";
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectEnvironmentFlags } from "./useRedirectEnvironmentFlags";

export const useRedirectUnauthenticatedSessions = () => {
  useRedirectEnvironmentFlags();
  const router = useRouter();
  const { status: authenticationStatus } = useSession();
  const { data: merchantMeData, status: merchantMeStatus } =
    useGetMerchantMeQuery();

  const { data: userMeData } = useGetUserMeQuery({
    merchants: true,
  });

  useEffect(() => {
    if (
      authenticationStatus === "unauthenticated" &&
      merchantMeStatus === "error"
    ) {
      router.push(routes.login);
    } else if (
      authenticationStatus === "authenticated" &&
      userMeData != undefined // check if customer
    ) {
      () => {};
    }
  }, [authenticationStatus, merchantMeData, merchantMeStatus]);

  return authenticationStatus;
};
