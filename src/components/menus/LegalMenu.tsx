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

import { routes } from "@/app/routes";
import { moaEnv } from "@/moaEnv";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LegalMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  function handleClose() {
    setAnchorEl(null);
  }
  const t = useTranslations("LegalMenu");
  const { push } = useRouter();

  return (
    <Box>
      <Button
        id="document-button"
        aria-controls={open ? "document-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        color="secondary"
      >
        {t("legal")}
      </Button>
      <Menu
        id="document-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose();
        }}
        MenuListProps={{
          "aria-labelledby": "document-button",
        }}
      >
        <MenuItem
          onClick={() => {
            window.open(moaEnv.termsUrl);
            handleClose();
          }}
        >
          {t("terms")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(moaEnv.privacyUrl);
            handleClose();
          }}
        >
          {t("privacy")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(moaEnv.gdprUrl);
            handleClose();
          }}
        >
          {t("gdpr")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            push(routes.licenses);
            handleClose();
          }}
        >
          {t("licenses")}
        </MenuItem>
      </Menu>
    </Box>
  );
}
