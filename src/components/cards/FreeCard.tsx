import { useCookieContext } from "@/contexts/CookieContext";
import AdUnitsIcon from "@mui/icons-material/AdUnits"; // Placeholder, replace with an appropriate icon
import PaletteIcon from "@mui/icons-material/Palette";
import PublishIcon from "@mui/icons-material/Publish"; // Placeholder, replace with an appropriate icon
import {
  Box,
  Button,
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

export function FreeCard() {
  const { currencyCookieValue } = useCookieContext();
  const format = useFormatter();
  const t = useTranslations("FreeCard");

  return (
    <Card>
      <CardHeader
        title={t("title")}
        titleTypographyProps={{ align: "center" }}
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
              format.number(0, {
                style: "currency",
                currency: currencyCookieValue,
                trailingZeroDisplay: "stripIfInteger",
              })}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t("perMonth")}
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <PaletteIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("customizationPrimary")}
              secondary={t("customizationSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AdUnitsIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("adSupportedPrimary")}
              secondary={t("adSupportedSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText
              primary={t("selfPublishedPrimary")}
              secondary={t("selfPublishedSecondary")}
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
        <Button variant="outlined" fullWidth>
          {t("buttonText")}
        </Button>
      </CardActions>
    </Card>
  );
}
