import { useGetMerchantMeQuery } from "@/networking/queries/useGetMerchantMeQuery";
import { Warning } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function DeleteMerchantMeDialog(props: {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}) {
  const { onClose, open } = props;

  const t = useTranslations("DeleteMerchantMeDialog");
  const { data: merchantMe } = useGetMerchantMeQuery();
  const [emailState, setEmailState] = useState<string>("");

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t("title")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("content")}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("emailLabel")}
          type="email"
          fullWidth
          variant="standard"
          value={emailState}
          onChange={(e) => setEmailState(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          variant="contained"
          color="primary"
        >
          {t("cancelButton")}
        </Button>
        <Button
          onClick={() => onClose(true)}
          variant="contained"
          color="error"
          disabled={emailState !== merchantMe?.user?.email}
          startIcon={<Warning />}
        >
          {t("deleteButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
