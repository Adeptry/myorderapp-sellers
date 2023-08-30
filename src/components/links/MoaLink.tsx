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
