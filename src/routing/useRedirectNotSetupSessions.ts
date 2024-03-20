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
import { useSession } from "next-auth/react";
import { useRouter } from "next-intl/client";
import { useEffect } from "react";
import { useRedirectUnauthenticatedSessions } from "./useRedirectUnauthenticatedSessions";

export const useRedirectNotSetupSessions = () => {
  useRedirectUnauthenticatedSessions();

  const { push } = useRouter();
  const { status: authenticationStatus } = useSession();
  const { data: merchantMe, status: queryStatus } = useGetMerchantMeQuery();

  useEffect(() => {
    if (queryStatus === "success") {
      if (merchantMe.appConfig == undefined) {
        push(routes.setup.theme);
      } else if (merchantMe.squareId == undefined) {
        push(routes.setup.square.index);
      } else if (merchantMe.catalog?.id == undefined) {
        push(routes.setup.catalog);
      } else if (merchantMe.tier == undefined) {
        push(routes.setup.plan);
      }
    }
  }, [authenticationStatus, merchantMe, queryStatus]);
};
