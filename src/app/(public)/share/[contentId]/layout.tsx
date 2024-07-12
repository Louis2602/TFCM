import { Header } from "@/components/global/header";
import { getCurrentUser } from "@/lib/lucia";

interface SharePageLayoutProps {
  children: React.ReactNode;
}

export default async function SharePageLayout({
  children,
}: SharePageLayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Header currentUser={currentUser} />
      <main className="pt-nav-height">{children}</main>
    </>
  );
}
