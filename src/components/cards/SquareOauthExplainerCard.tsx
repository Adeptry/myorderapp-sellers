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
          <ListItem>
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText
              primary={t("catalogSyncPrimary")}
              secondary={t("catalogSyncSecondary")}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Receipt />
            </ListItemIcon>
            <ListItemText
              primary={t("orderSubmissionPrimary")}
              secondary={t("orderSubmissionSecondary")}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <PointOfSale />
            </ListItemIcon>
            <ListItemText
              primary={t("posIntegrationPrimary")}
              secondary={t("posIntegrationSecondary")}
            />
          </ListItem>

          <ListItem>
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

      <CardActions sx={{ justifyContent: "center", pb: 5 }}>
        <SquareOauthButton size="large" />
      </CardActions>
    </Card>
  );
}
