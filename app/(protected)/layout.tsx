export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr" className="scroll-smooth">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
