import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { OneTap } from "@/components/auth/OneTap";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ar" dir="ltr" className="scroll-smooth">
      <body
        className={`${cairo.variable} antialiased flex flex-col min-h-screen`}
      >
        {!user && <OneTap />}
        {children}
      </body>
    </html>
  );
}
