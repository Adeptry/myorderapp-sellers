import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import NextLink from "next-intl/link";
import { forwardRef, ReactNode } from "react";

// Combine MuiLinkProps with our additional properties
export interface MoaLinkProps extends MuiLinkProps {
  href: string;
  as?: string;
  children: ReactNode;
}

export const MoaLink = forwardRef<HTMLAnchorElement, MoaLinkProps>(
  (props, ref) => {
    const { href, as, children, ...muiLinkProps } = props;

    return (
      <NextLink href={href} as={as} passHref>
        <MuiLink ref={ref} {...muiLinkProps}>
          {children}
        </MuiLink>
      </NextLink>
    );
  }
);

MoaLink.displayName = "MoaLink";
