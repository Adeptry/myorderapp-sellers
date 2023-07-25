import { Google } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function GoogleAuthButton() {
  return (
    <Button
      variant="outlined"
      startIcon={<Google />}
      size="large"
      fullWidth
      sx={{ whiteSpace: "nowrap" }}
    >
      Continue with Google
    </Button>
  );
}
