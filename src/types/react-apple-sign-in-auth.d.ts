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
