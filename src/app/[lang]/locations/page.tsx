"use client";

import { usePatchLocationMutation } from "@/mutations/usePatchLocationMutation";
import { useGetLocationsMeQuery } from "@/queries/useGetLocationsMeQuery";
import { useRedirectSetupSessions } from "@/routing/useRedirectSetupSessions";
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

export default function Page() {
  useRedirectSetupSessions();
  const t = useTranslations("LocationsPage");
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
                    primary={location.name}
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
