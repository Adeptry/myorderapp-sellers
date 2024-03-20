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
import { moaEnv } from "@/moaEnv";
import { useGetSquareLogoutMeMutation } from "@/networking/mutations/useGetSquareLogoutMeMutation";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { Button, Skeleton, SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { default as NextLink } from "next/link";
import { Fragment, useState } from "react";
import { SiSquare } from "react-icons/si";
import { DeauthorizeSquareDialog } from "../dialogs/DeauthorizeSquareDialog";
import { useCookieContext } from "../providers/CookieContext";

interface SquareOauthButtonProps {
  scope?: string;
  locale?: string;
  session?: boolean;
  code_challenge?: string;
  redirect_uri?: string;
  size?: "small" | "large" | "medium";
  csrfToken?: string;
  sx?: SxProps;
}

export function SquareOauthButton(props: SquareOauthButtonProps) {
  const { squareCsrfTokenCookieValue } = useCookieContext();
  const {
    scope = moaEnv.square.scope,
    locale,
    session = false,
    code_challenge,
    redirect_uri,
    size,
    csrfToken = squareCsrfTokenCookieValue,
  } = props;

  const { data } = useGetMerchantMeQuery();
  const squareLogoutMeMutation = useGetSquareLogoutMeMutation();
  const [showLogoutDialogState, setShowLogoutDialogState] =
    useState<boolean>(false);

  const t = useTranslations("SquareOauthButton");

  let urlString = `${moaEnv.square.baseUrl}/oauth2/authorize?state=${csrfToken}&client_id=${moaEnv.square.clientId}&scope=${scope}&session=${session}`;

  if (locale) {
    urlString += `&locale=${locale}`;
  }

  if (code_challenge) {
    urlString += `&code_challenge=${code_challenge}`;
  }

  if (redirect_uri) {
    urlString += `&redirect_uri=${redirect_uri}`;
  }

  if (
    moaEnv.square.testCode != undefined &&
    moaEnv.square.testCode.length > 0
  ) {
    urlString = `${routes.setup.square.sync}?code=${moaEnv.square.testCode}`;
  }

  if (!data?.id || !csrfToken) {
    return <Skeleton height="56px" width={"192px"} />;
  } else {
    if (!(data.squareConnected ?? false)) {
      return (
        <Button
          sx={props.sx}
          href={urlString}
          component={NextLink}
          startIcon={<SiSquare />}
          variant="contained"
          color="secondary"
          size={size}
        >
          {t("authorize")}
        </Button>
      );
    } else {
      return (
        <Fragment>
          <DeauthorizeSquareDialog
            open={showLogoutDialogState}
            onClose={(confirmed) => {
              setShowLogoutDialogState(false);
              if (confirmed) {
                squareLogoutMeMutation.mutateAsync();
              }
            }}
          />
          <Button
            sx={props.sx}
            startIcon={<SiSquare />}
            onClick={() => setShowLogoutDialogState(true)}
            variant="contained"
            color="error"
            size={size}
          >
            {t("deauthorize")}
          </Button>
        </Fragment>
      );
    }
  }
}
