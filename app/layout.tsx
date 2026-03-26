import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cairo = localFont({
  src: [
    {
      path: "../public/font/Cairo/Cairo-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/font/Cairo/Cairo-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/font/Cairo/Cairo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/Cairo/Cairo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/Cairo/Cairo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/Cairo/Cairo-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "وصيتي",
  description: "منصة وصيتي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr">
      <body className={`${cairo.variable} antialiased`}>{children}</body>
    </html>
  );
}
