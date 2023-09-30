import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { Tier0CheckoutCard } from "../cards/Tier0CheckoutCard";
import { Tier1CheckoutCard } from "../cards/Tier1CheckoutCard";
import { Tier2CheckoutCard } from "../cards/Tier2CheckoutCard";

export default function PriceGrid() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={2}
      direction={isSmallScreen ? "column-reverse" : "row"}
      sx={{
        pr: 1,
      }}
    >
      <Grid item xs={12} md={4}>
        <Tier0CheckoutCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <Tier1CheckoutCard />
      </Grid>
      <Grid item xs={12} md={4}>
        <Tier2CheckoutCard />
      </Grid>
    </Grid>
  );
}
