import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function MarketingLayout({
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
