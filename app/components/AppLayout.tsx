import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
