import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function SetupAppConfigDialog(props: {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}) {
  const { onClose, open } = props;

  const t = useTranslations("SetupAppConfigDialog");

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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          variant="contained"
          color="secondary"
        >
          {t("button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
