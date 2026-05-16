import Footer from "@/components/landing/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grow">{children}</main>
      <div className="mx-auto w-full mt-auto">
        <Footer />
      </div>
    </>
  );
}
