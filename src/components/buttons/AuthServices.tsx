import { Grid, Skeleton } from "@mui/material";
import AppleAuthButton from "./AppleAuthButton";
import GoogleAuthButton from "./GoogleAuthButton";

export default function AuthServicesButtons(props: { preloading?: boolean }) {
  const { preloading } = props;
  return (
    <Grid container rowGap={preloading ? 0 : 2}>
      <Grid item xs={12}>
        {preloading ? <Skeleton height="56px" /> : <GoogleAuthButton />}
      </Grid>
      <Grid item xs={12}>
        {preloading ? <Skeleton height="56px" /> : <AppleAuthButton />}
      </Grid>
    </Grid>
  );
}
