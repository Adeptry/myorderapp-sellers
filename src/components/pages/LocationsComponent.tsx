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

"use client";

import { usePatchLocationMutation } from "@/networking/mutations/usePatchLocationMutation";
import { useGetLocationsMeQuery } from "@/networking/queries/useGetLocationsMeQuery";
import { useRedirectNotSetupSessions } from "@/routing/useRedirectNotSetupSessions";
import { useMaxHeightCssString } from "@/utils/useMaxHeight";
import { InfoOutlined, StoreOutlined } from "@mui/icons-material";
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

export function LocationsComponent() {
  useRedirectNotSetupSessions();
  const t = useTranslations("LocationsComponent");
  const maxHeightCssString = useMaxHeightCssString();

  const { data: locationsMeResponse } = useGetLocationsMeQuery({
    actingAs: "merchant",
    address: true,
    businessHours: true,
  });

  const { mutateAsync: patchLocation } = usePatchLocationMutation();

  const locations = locationsMeResponse?.data ?? [];

  return (
    <Container sx={{ minHeight: maxHeightCssString }}>
      <Grid container justifyContent="center" py={2}>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="baseline"
            spacing={2}
          >
            <Box />
            <Typography component="h1" variant="h4" pb={3}>
              {t("title")}
            </Typography>
            <Tooltip title={t("tooltipTitle")}>
              <InfoOutlined />
            </Tooltip>
          </Stack>

          <List>
            {locations.map((location, index, array) => (
              <Fragment key={location.id}>
                <ListItem>
                  <ListItemIcon>
                    <StoreOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={location.businessName ?? location.name}
                    secondary={location.address?.addressLine1}
                  />
                  <Switch
                    edge="end"
                    checked={location.moaEnabled ?? false}
                    onChange={async (_event, checked) =>
                      patchLocation({
                        id: location.id!,
                        locationPatchBody: { moaEnabled: checked },
                      })
                    }
                  />
                </ListItem>
                {index !== array.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}
