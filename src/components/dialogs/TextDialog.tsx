/*
    This code is part of the myorderapp-sellers front-end.
    Copyright (C) 2024  Adeptry, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

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
