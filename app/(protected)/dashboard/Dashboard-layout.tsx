export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="ltr" className="scroll-smooth">
      <main>{children}</main>
    </html>
  );
}
