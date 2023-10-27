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
