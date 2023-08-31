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
import { useTranslations } from "next-intl";

export const FooterLayout = () => {
  const year = new Date().getFullYear();
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const common = useTranslations("Common");

  return (
    <Grid
      container
      px={2}
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
            {isSmallScreen ? common("brandNameShort") : common("brandName")}{" "}
            &copy; {year}
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
