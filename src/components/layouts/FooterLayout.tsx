import { Grid, Typography } from "@mui/material";
import { LanguageSelect } from "../LanguageSelect";

export const FooterLayout = () => {
  const year = new Date().getFullYear();

  return (
    <Grid
      container
      spacing={3}
      px={3}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={4}></Grid>
      <Grid item xs={4} textAlign={"center"}>
        <Typography variant="body1">MyOrderApp &copy; {year}</Typography>
      </Grid>
      <Grid item xs={4} textAlign={"right"}>
        <LanguageSelect />
      </Grid>
    </Grid>
  );
};
