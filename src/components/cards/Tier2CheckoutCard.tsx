import { StripeCheckoutButton } from "@/components/buttons/StripeCheckoutButton";
import { constants } from "@/constants";
import { useCookieContext } from "@/contexts/CookieContext";
import { Apple } from "@mui/icons-material";
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

export function Tier2CheckoutCard() {
  const format = useFormatter();
  const t = useTranslations("Tier2CheckoutCard");
  const common = useTranslations("Common");
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
        action={<Apple />}
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
                  constants.currencyToPriceDictionaries[2][currencyCookieValue],
                  {
                    style: "currency",
                    currency: currencyCookieValue,
                    trailingZeroDisplay: "stripIfInteger",
                  }
                )}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {common("perMonth")}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {t("transactionFee")}
          </Typography>
        </Stack>
        <CardActions>
          <StripeCheckoutButton fullWidth tier={2} text={t("buttonText")} />
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
