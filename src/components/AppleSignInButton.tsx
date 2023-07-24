import Head from "next/head";
import Script from "next/script";

export function AppleSignInButton() {
  return (
    <>
      <Head>
        <meta name="appleid-signin-client-id" content="[CLIENT_ID]" />
        <meta name="appleid-signin-scope" content="[SCOPES]" />
        <meta name="appleid-signin-redirect-uri" content="[REDIRECT_URI]" />
        <meta name="appleid-signin-state" content="[STATE]" />
      </Head>
      <div id="appleid-signin"></div>
      <Script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" />
    </>
  );
}
