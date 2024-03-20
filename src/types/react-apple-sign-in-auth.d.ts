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

declare module "react-apple-signin-auth" {
  import { CSSProperties, FC, ReactNode } from "react";

  export interface AuthOptions {
    clientId: string;
    scope: string;
    redirectURI: string;
    state: string;
    nonce: string;
    usePopup: boolean;
  }

  export interface IconProps {
    style: CSSProperties;
  }

  interface AppleSigninProps {
    authOptions: AuthOptions;
    uiType?: "dark" | "light";
    className?: string;
    noDefaultStyle?: boolean;
    buttonExtraChildren?: string | ReactNode;
    onSuccess?: (response: any) => void; // replace 'any' with the actual response type if known
    onError?: (error: any) => void; // replace 'any' with the actual error type if known
    skipScript?: boolean;
    iconProp?: IconProps;
    render?: (props: any) => JSX.Element; // replace 'any' with the actual props type if known
  }

  const AppleSignin: FC<AppleSigninProps>;

  export default AppleSignin;
}
