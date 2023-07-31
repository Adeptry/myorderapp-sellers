import { Box, SxProps } from "@mui/material";
import React from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

export default function DevicePreview(props: {
  iframeRef?: React.RefObject<HTMLIFrameElement>;
  sx?: SxProps;
}) {
  const { iframeRef, sx } = props;
  return (
    <Box sx={{ ...sx }}>
      <DeviceFrameset device="HTC One" color="black">
        <iframe
          ref={iframeRef}
          id="flutter-iframe"
          src="https://moa-cafe.web.app/"
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
