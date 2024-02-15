import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";

export function ErrorTextDialog(props: {
  open: boolean;
  onClose: () => void;
  title?: string;
  button?: string;
  message: string;
}) {
  const { onClose, open, title, message, button } = props;

  const t = useTranslations("ErrorTextDialog");

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="error-text-dialog-title"
      aria-describedby="error-text-dialog-description"
    >
      <DialogTitle id="error-text-dialog-title">
        {title ?? t("fallbackTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="error-text-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="contained" color="secondary">
          {button ?? t("fallbackButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
