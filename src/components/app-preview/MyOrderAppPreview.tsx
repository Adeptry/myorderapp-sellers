import { MessagingIframe } from "@/components/messaging-iframe/MessagingIframe";
import { toWindowClonable } from "@/components/messaging-iframe/WindowClonable";
import { useCurrentMerchantQuery } from "@/queries/useCurrentMerchantQuery";
import { moaEnv } from "@/utils/moaEnv";
import { Box, SxProps } from "@mui/material";
import { AppConfig, Category } from "moa-merchants-ts-axios";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import "./styles.css";

export function MyOrderAppPreview(props: {
  sx?: SxProps;
  categories?: Array<Category>;
  appConfig?: AppConfig;
  environment: {
    apiBaseUrl: string | null;
    apiKey: string | null;
    isPreview: boolean | null;
    languageCodeOverride: string | null;
  } | null;
}) {
  const { sx } = props;
  const { data: currentMerchantData } = useCurrentMerchantQuery();

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <DeviceFrameset device="HTC One" color="black" style={{}}>
        {currentMerchantData?.id && (
          <MessagingIframe
            id="flutter-iframe"
            src={`${moaEnv.previewUrl}/#/${currentMerchantData?.id}/catalog`}
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
        )}
      </DeviceFrameset>
    </Box>
  );
}
