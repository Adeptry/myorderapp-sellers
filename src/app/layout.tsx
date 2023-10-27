import { moaEnv } from "@/moaEnv";
import { Metadata } from "next";
import { Fragment, ReactNode } from "react";
import { openGraphImages } from "./shared-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(moaEnv.siteUrl),
    ...moaEnv.metadata,
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        es: "/es",
        fr: "/fr",
        ja: "/ja",
      },
    },
    openGraph: {
      ...openGraphImages,
      title: moaEnv.name,
      description: moaEnv.description,
      url: new URL(moaEnv.siteUrl),
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Fragment>{children}</Fragment>;
}
