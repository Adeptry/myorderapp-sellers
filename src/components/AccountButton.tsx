import { routes } from "@/app/routes";
import { useNetworkingContext } from "@/components/networking/useNetworkingContext";
import { AccountCircle } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountButton() {
  const { push } = useRouter();
  const { session, setSession } = useNetworkingContext();
  const [open, setIsOpen] = useState(false);

  return (
    session && (
      <>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => {
            setIsOpen(true);
          }}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(open)}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <MenuItem
            onClick={() => {
              setSession(null);
              push(routes.signin);
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </>
    )
  );
}
