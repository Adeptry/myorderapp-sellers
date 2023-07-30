import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

export default function Page() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={3}
    >
      <Card elevation={1}>
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={3}
            gap={3}
          >
            <CheckCircleOutline sx={{ fontSize: 60, color: green[500] }} />
            <Typography variant="h4" component="div" gutterBottom>
              Congratulations!
            </Typography>
            <Typography variant="body1" textAlign="center">
              You've successfully checked out and subscribed to MyOrderApp. This
              service will publish a mobile ordering app for your Square
              merchant business to both Android and iOS.
            </Typography>
            <Typography variant="body1" textAlign="center" marginTop={2}>
              A member of our team will be in touch with you within the next
              business day to keep you in the loop as your app gets published.
              We're excited to have you onboard and can't wait to see your
              business grow!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
