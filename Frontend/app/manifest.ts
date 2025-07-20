import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YASHBLOG - A place to read, write, and deepen understanding",
    short_name: "YASHBLOG",
    description:
      "A place to read, write, and deepen your understanding of the world around us.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#1e293b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "lifestyle", "news", "social"],
    lang: "en-US",
    dir: "ltr",
    scope: "/",
  };
}
