import { Grid, Skeleton } from "@mui/material";
import AppleAuthButton from "./AppleAuthButton";
import GoogleAuthButton from "./GoogleAuthButton";

export default function AuthServicesButtons(props: { skeleton?: boolean }) {
  const { skeleton } = props;
  return (
    <Grid container rowGap={skeleton ? 0 : 2}>
      <Grid item xs={12}>
        {skeleton ? <Skeleton height="56px" /> : <GoogleAuthButton />}
      </Grid>
      <Grid item xs={12}>
        {skeleton ? <Skeleton height="56px" /> : <AppleAuthButton />}
      </Grid>
    </Grid>
  );
}
