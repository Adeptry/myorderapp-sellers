import { moaEnv } from "@/utils/config";
import { logger } from "@/utils/logger";
import { Box, SxProps } from "@mui/material";
import { AppConfig, Category } from "moa-merchants-ts-axios";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import MessagingIframe from "../messaging-iframe/MessagingIframe";
import { toWindowClonable } from "../messaging-iframe/WindowClonable";
import "./styles.css";

export function MyOrderAppPreview(props: {
  sx?: SxProps;
  categories?: Array<Category>;
  appConfig?: AppConfig;
  environment: {
    apiBaseUrl: string | null;
    apiKey: string | null;
    merchantFrontendUrl: string | null;
    merchantId: string | null;
    isPreview: boolean | null;
  } | null;
}) {
  const { sx } = props;
  logger.info(props, "Rendering MyOrderAppPreview");

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <DeviceFrameset device="HTC One" color="black" style={{}}>
        <MessagingIframe
          id="flutter-iframe"
          src={moaEnv.previewUrl}
          sendMessageState={{
            type: "state",
            payload: {
              categories: toWindowClonable(props.categories),
              appConfig: toWindowClonable(props.appConfig),
              environment: props.environment,
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      </DeviceFrameset>
    </Box>
  );
}
