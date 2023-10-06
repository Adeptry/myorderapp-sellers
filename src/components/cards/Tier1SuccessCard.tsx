import { AdUnits, Palette } from "@mui/icons-material"; // Assume these icons exist or replace them with actual ones
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SxProps,
} from "@mui/material";
import { useTranslations } from "next-intl";

export function Tier1SuccessCard(props: { sx?: SxProps }) {
  const t = useTranslations("Tier1SuccessCard");
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
    </Card>
  );
}
