import {
  Box,
  Grid,
  Stack,
  SxProps,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

interface Props {
  tabLabels: string[];
  children: JSX.Element[];
  sx?: SxProps;
}

export const TabLayout: React.FC<Props> = ({ children, tabLabels, sx }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(780));
  const [tabValueState, setTabValueState] = useState("0");

  return (
    <Stack style={{ marginTop: "6px" }} sx={sx}>
      <Box display={isSmallScreen ? "block" : "none"}>
        <Tabs
          sx={{ pb: 3 }}
          variant="fullWidth"
          value={tabValueState}
          onChange={(e, v) => setTabValueState(v)}
          aria-label="tab layout example"
        >
          {children.map((_child, index) => (
            <Tab label={tabLabels[index]} value={String(index)} key={index} />
          ))}
        </Tabs>
      </Box>
      <Grid container spacing={2}>
        {children.map((child, index) => (
          <Grid
            item
            xs={isSmallScreen ? 12 : 6}
            display={
              isSmallScreen
                ? tabValueState !== String(index)
                  ? "none"
                  : "flex"
                : "flex"
            }
            justifyContent="center"
          >
            {child}
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
