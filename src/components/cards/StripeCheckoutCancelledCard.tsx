import { Card, CardContent, SxProps, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export function StripeCheckoutCancelledCard(props: { sx?: SxProps }) {
  const t = useTranslations("StripeCheckoutCancelledCard");
  return (
    <Card sx={props.sx}>
      <CardContent>
        <Typography variant="h4" gutterBottom textAlign={"center"}>
          {t("title")}
        </Typography>

        <Typography variant="body1" gutterBottom textAlign={"center"}>
          {t("body")}
        </Typography>
      </CardContent>
    </Card>
  );
}
