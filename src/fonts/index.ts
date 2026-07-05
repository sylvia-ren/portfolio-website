import localFont from "next/font/local";

/*
 * satoshi, self-hosted (fontshare / indian type foundry free license).
 * two weights only: light for display, regular for reading and labels.
 * no bold anywhere — emphasis comes from size, space and placement.
 */
export const satoshi = localFont({
  src: [
    { path: "./satoshi-light.woff2", weight: "300", style: "normal" },
    { path: "./satoshi-regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
