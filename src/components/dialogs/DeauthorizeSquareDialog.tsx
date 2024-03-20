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

export function DeauthorizeSquareDialog(props: {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}) {
  const { onClose, open } = props;

  const t = useTranslations("DeauthorizeSquareDialog");
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
          color="secondary"
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
