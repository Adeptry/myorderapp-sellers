import { Apple } from "@mui/icons-material";
import { Button } from "@mui/material";
import AppleSignin from "react-apple-signin-auth";

export default function AppleAuthButton() {
  return (
    <AppleSignin
      authOptions={{
        clientId: "com.example.web",
        scope: "email name",
        redirectURI: "https://example.com",
        state: "state",
        nonce: "nonce",
        usePopup: false,
      }}
      render={(props) => (
        <Button
          variant="outlined"
          startIcon={<Apple />}
          fullWidth
          size="large"
          sx={{ whiteSpace: "nowrap" }}
        >
          Continue with Apple
        </Button>
      )}
    />
  );
}
