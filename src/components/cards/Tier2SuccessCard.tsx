/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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

export function Tier2SuccessCard(props: { sx?: SxProps }) {
  const t = useTranslations("Tier2SuccessCard");

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
