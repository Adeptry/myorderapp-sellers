import { StripeCheckoutButton } from "@/components/buttons/StripeCheckoutButton";
import { constants } from "@/constants";
import { useCookieContext } from "@/contexts/CookieContext";
import MobileFriendly from "@mui/icons-material/MobileFriendly";
import Palette from "@mui/icons-material/Palette";
import StarIcon from "@mui/icons-material/StarBorder";
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
  Typography,
} from "@mui/material";
import { useFormatter, useTranslations } from "next-intl";

export function SubscribeCard() {
  const format = useFormatter();
  const t = useTranslations("SubscribeCard");
  const { currencyCookieValue } = useCookieContext();

  return (
    <Card>
      <CardHeader
        title={t("title")}
        subheader={t("subheader")}
        titleTypographyProps={{ align: "center" }}
        action={<StarIcon />}
        subheaderTypographyProps={{
          align: "center",
        }}
        sx={{
          backgroundColor: "grey.200",
        }}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            mb: 2,
          }}
        >
          <Typography component="h2" variant="h3" color="text.primary">
            {currencyCookieValue &&
              format.number(
                constants.currencyToPriceDictionary[currencyCookieValue],
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
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <MobileFriendly />
            </ListItemIcon>
            <ListItemText
              primary={t("publishingPrimary")}
              secondary={t("publishingSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText
              primary={t("customizationPrimary")}
              secondary={t("customizationSecondary")}
            />
          </ListItem>
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
        <Typography variant="h6" color="text.secondary" mt={2}>
          {t("perfectForHeader")}
        </Typography>
        <Typography variant="body2" color="text.primary" mt={1}>
          {t("perfectForBody")}
        </Typography>
      </CardContent>
      <CardActions>
        <StripeCheckoutButton fullWidth isPro />
      </CardActions>
    </Card>
  );
}
