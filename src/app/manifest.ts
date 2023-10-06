import { moaEnv } from "@/moaEnv";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: moaEnv.name,
    short_name: moaEnv.shortName,
    description: moaEnv.description,
    start_url: "/",
    scope: "/",
    orientation: "portrait-primary",
    display: "standalone",
    background_color: moaEnv.theme.palette.light.secondary.main,
    theme_color: moaEnv.theme.palette.light.primary.main,
    icons: [
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
