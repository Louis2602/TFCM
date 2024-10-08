import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { getCurrentUser } from "@/lib/lucia";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Header currentUser={currentUser} />
      <main className="pt-nav-height">
        <section className="relative before:absolute before:h-[400px] before:container before:left-1/2 before:-translate-x-1/2 before:pointer-events-none before:z-[1] before:bg-header-gradient before:-top-nav-height">
          {children}
        </section>
      </main>
      <Footer />
    </>
  );
}
