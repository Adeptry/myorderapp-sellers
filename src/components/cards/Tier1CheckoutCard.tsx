import { StripeCheckoutButton } from "@/components/buttons/StripeCheckoutButton";
import { moaEnv } from "@/moaEnv";
import { Currency } from "@/types/next";
import { Android } from "@mui/icons-material";
import SupportAgent from "@mui/icons-material/SupportAgent";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useFormatter, useTranslations } from "next-intl";
import { useCookieContext } from "../providers/CookieContext";

export function Tier1CheckoutCard() {
  const format = useFormatter();
  const t = useTranslations("Tier1CheckoutCard");
  const { currencyCookieValue } = useCookieContext();

  return (
    <Card>
      <CardHeader
        title={t("title")}
        subheader={t("subheader")}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{
          align: "center",
        }}
        action={<Android />}
        sx={{ pb: 0 }}
      />
      <CardContent style={{ paddingBottom: 8 }}>
        <Stack alignItems={"center"} sx={{ mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}
          >
            <Typography component="h2" variant="h3" color="text.primary">
              {currencyCookieValue &&
                format.number(
                  moaEnv.stripe.prices[1][currencyCookieValue as Currency],
                  {
                    style: "currency",
                    currency: currencyCookieValue,
                    trailingZeroDisplay: "stripIfInteger",
                  }
                )}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t("perMonth")}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("transactionFee")}
          </Typography>
        </Stack>
        <CardActions>
          <StripeCheckoutButton fullWidth tier={1} text={t("buttonText")} />
        </CardActions>
        <Typography variant="h6" color="text.secondary" mt={2}>
          {t("perfectForHeader")}
        </Typography>
        <Typography variant="body2" color="text.primary" mt={1}>
          {t("perfectForBody")}
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <SupportAgent />
            </ListItemIcon>
            <ListItemText
              primary={t("supportPrimary")}
              secondary={t("supportSecondary")}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
