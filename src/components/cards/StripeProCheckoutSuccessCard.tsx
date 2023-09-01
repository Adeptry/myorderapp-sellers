import { routes } from "@/app/routes";
import {
  AccountCircle,
  Build,
  CalendarToday,
  Edit,
  Reviews,
  Timer,
} from "@mui/icons-material";
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

export function StripeProCheckoutSuccessCard(props: { sx?: SxProps }) {
  const t = useTranslations("StripeProCheckoutSuccessCard");
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
              <Build />
            </ListItemIcon>
            <ListItemText
              primary={t("buildPrimary")}
              secondary={t("buildSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText
              primary={t("accountPrimary")}
              secondary={t("accountSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <Reviews />
            </ListItemIcon>
            <ListItemText
              primary={t("reviewPrimary")}
              secondary={t("reviewSecondary")}
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
          <ListItem disablePadding>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText
              primary={t("calendarPrimary")}
              secondary={t("calendarSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText
              primary={t("editPrimary")}
              secondary={t("editSecondary")}
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
