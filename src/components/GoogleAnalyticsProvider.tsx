import { moaEnv } from "@/utils/moaEnv";
import Script from "next/script";
import { Fragment, ReactNode } from "react";

export default function GoogleAnalyticsProvider(props: {
  children: ReactNode;
}) {
  return (
    <Fragment>
      <Script
        id="gtm"
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${moaEnv.google.measurementId}`}
      />
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${moaEnv.google.measurementId}');
        `}
      </Script>
      {props.children}
    </Fragment>
  );
}
