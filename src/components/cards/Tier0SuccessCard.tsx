import { routes } from "@/app/routes";
import { useCurrentMerchantMoaUrl } from "@/utils/useCurrentMerchantMoaUrl";
import { AdUnits, Palette } from "@mui/icons-material"; // Assume these icons exist or replace them with actual ones
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

export function Tier0SuccessCard(props: { sx?: SxProps }) {
  const t = useTranslations("Tier0SuccessCard");
  const common = useTranslations("Common");
  const { push } = useRouter();
  const moaUrl = useCurrentMerchantMoaUrl();
  return (
    <Card sx={props.sx}>
      <CardHeader
        title={t("title")}
        subheader={t("subheader")}
        titleTypographyProps={{ align: "center" }}
        subheaderTypographyProps={{
          align: "center",
        }}
      />
      <CardContent sx={{ pb: 0 }}>
        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <Palette />
            </ListItemIcon>
            <ListItemText
              primary={t("nextStepsPrimary")}
              secondary={t("nextStepsSecondary")}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon>
              <AdUnits />
            </ListItemIcon>
            <ListItemText
              primary={t("supportPrimary")}
              secondary={t("supportSecondary")}
            />
          </ListItem>
        </List>
      </CardContent>
      <CardActions>
        <Button onClick={() => push(routes.support)}>
          {common("support")}
        </Button>
        <Button
          onClick={() => {
            window.open(moaUrl, "_blank");
          }}
        >
          {common("useMyOrderApp")}
        </Button>
      </CardActions>
    </Card>
  );
}
