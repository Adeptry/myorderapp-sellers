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

import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import NextLink from "next-intl/link";
import { forwardRef, ReactNode } from "react";

export interface MoaLinkProps extends Omit<MuiLinkProps, "href" | "as"> {
  href: string;
  as?: string;
  children: ReactNode;
}

export const MoaLink = forwardRef<HTMLAnchorElement, MoaLinkProps>(
  (props, ref) => {
    const { href, children, ...muiLinkProps } = props;
    return (
      <MuiLink ref={ref} href={href} component={NextLink} {...muiLinkProps}>
        {children}
      </MuiLink>
    );
  }
);

MoaLink.displayName = "MoaLink";
