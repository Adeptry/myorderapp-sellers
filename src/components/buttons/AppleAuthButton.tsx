import { Apple } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function AppleAuthButton() {
  return (
    <Button
      variant="outlined"
      startIcon={<Apple />}
      fullWidth
      size="large"
      sx={{ whiteSpace: "nowrap" }}
    >
      Continue with Apple
    </Button>
  );
}
