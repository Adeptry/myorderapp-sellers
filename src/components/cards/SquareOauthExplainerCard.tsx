import { SquareOauthButton } from "@/components/buttons/SquareOauthButton";
import { MenuBook, PointOfSale, Receipt, Shield } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SxProps,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

export function SquareOauthExplainerCard(props: { sx?: SxProps }) {
  const t = useTranslations("SquareOauthExplainerCard");
  return (
    <Card sx={props.sx}>
      <CardContent>
        <Typography variant="h4" gutterBottom textAlign={"center"}>
          {t("title")}
        </Typography>

        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText
              primary={t("catalogSyncPrimary")}
              secondary={t("catalogSyncSecondary")}
            />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <Receipt />
            </ListItemIcon>
            <ListItemText
              primary={t("orderSubmissionPrimary")}
              secondary={t("orderSubmissionSecondary")}
            />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <PointOfSale />
            </ListItemIcon>
            <ListItemText
              primary={t("posIntegrationPrimary")}
              secondary={t("posIntegrationSecondary")}
            />
          </ListItem>

          <ListItem disablePadding>
            <ListItemIcon>
              <Shield />
            </ListItemIcon>
            <ListItemText
              primary={t("dataSecurityPrimary")}
              secondary={t("dataSecuritySecondary")}
            />
          </ListItem>
        </List>
      </CardContent>

      <CardActions sx={{ justifyContent: "center", pb: 2 }}>
        <SquareOauthButton />
      </CardActions>
    </Card>
  );
}
