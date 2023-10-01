import { MessagingIframe } from "@/components/messaging-iframe/MessagingIframe";
import { toWindowClonable } from "@/components/messaging-iframe/WindowClonable";
import { useGetMerchantMeQuery } from "@/queries/useGetMerchantMeQuery";
import { moaEnv } from "@/utils/moaEnv";
import { Box, SxProps } from "@mui/material";
import { AppConfigEntity, CategoryEntity } from "myorderapp-square";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import "./styles.css";

export function MyOrderAppPreview(props: {
  sx?: SxProps;
  categories?: Array<CategoryEntity>;
  appConfig?: AppConfigEntity;
  environment: {
    apiBaseUrl: string | null;
    apiKey: string | null;
    isPreview: boolean | null;
    languageCodeOverride: string | null;
  } | null;
}) {
  const { sx } = props;
  const { data: currentMerchantData } = useGetMerchantMeQuery();

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
            src={`${moaEnv.appUrl}/${currentMerchantData?.id}`}
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
