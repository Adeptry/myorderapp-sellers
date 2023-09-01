import { routes } from "@/app/routes";
import { AdUnits, Palette, Publish, Timer } from "@mui/icons-material"; // Assume these icons exist or replace them with actual ones
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SxProps,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";

export function StripeFreeCheckoutSuccessCard(props: { sx?: SxProps }) {
  const t = useTranslations("StripeFreeCheckoutSuccessCard");
  const common = useTranslations("Common");
  const { push } = useRouter();
  return (
    <Card sx={props.sx}>
      <CardHeader
        title={t("title")}
        subheader={t("subheader")}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{
          align: "center",
        }}
        sx={{
          backgroundColor: "grey.200",
        }}
      />
      <CardContent sx={{ pb: 0 }}>
        <List>
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
              <AdUnits />
            </ListItemIcon>
            <ListItemText
              primary={t("adSupportedPrimary")}
              secondary={t("adSupportedSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <Publish />
            </ListItemIcon>
            <ListItemText
              primary={t("selfPublishedPrimary")}
              secondary={t("selfPublishedSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <Timer />
            </ListItemIcon>
            <ListItemText
              primary={t("timerPrimary")}
              secondary={t("timerSecondary")}
            />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <Button onClick={() => push(routes.catalog)}>
          {common("catalog")}
        </Button>
        <Button onClick={() => push(routes.theme)}>{common("theme")}</Button>
      </CardActions>
    </Card>
  );
}
