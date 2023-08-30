import { LegalMenu } from "@/components/menus/LegalMenu";
import { CurrencySelector } from "@/components/selectors/CurrencySelector";
import { LanguageSelector } from "@/components/selectors/LanguageSelector";
import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export const FooterLayout = () => {
  const year = new Date().getFullYear();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      container
      pr={2}
      pl={isSmallScreen ? 2 : 0}
      py={1}
      justifyContent="space-between"
      alignItems={"center"}
    >
      <Grid item md={4} xs={"auto"}>
        <LegalMenu />
      </Grid>
      {!isExtraSmallScreen && (
        <Grid item textAlign="center" md={4} xs="auto">
          <Typography variant="body1">
            {isSmallScreen ? "MOA" : "MyOrderApp"} &copy; {year}
          </Typography>
        </Grid>
      )}
      <Grid item md={4}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <CurrencySelector />
          <LanguageSelector />
        </Stack>
      </Grid>
    </Grid>
  );
};
