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

import { MessagingIframe } from "@/components/messaging-iframe/MessagingIframe";
import { toWindowClonable } from "@/components/messaging-iframe/WindowClonable";
import { moaEnv } from "@/moaEnv";
import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { Box, SxProps } from "@mui/material";
import {
  AppConfigEntity,
  AuthenticationResponse,
  CategoryEntity,
} from "myorderapp-square";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import "./styles.css";

export function MyOrderAppPreview(props: {
  sx?: SxProps;
  categories?: Array<CategoryEntity>;
  appConfig?: AppConfigEntity;
  authentication?: AuthenticationResponse;
}) {
  const { sx } = props;
  const { data: merchantMe } = useGetMerchantMeQuery();

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <DeviceFrameset device="HTC One" color="black" style={{}}>
        {merchantMe?.id && (
          <MessagingIframe
            id="flutter-iframe"
            src={`${moaEnv.appUrl}/${merchantMe?.id}`}
            sendMessageState={{
              type: "state",
              payload: {
                authentication: toWindowClonable(props.authentication),
                categories: toWindowClonable(props.categories),
                appConfig: toWindowClonable(props.appConfig),
              },
            }}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        )}
      </DeviceFrameset>
    </Box>
  );
}
