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
