import { Header } from "@/components/global/header";
import { getCurrentUser } from "@/lib/lucia";

export default async function SharePageLayout() {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Header currentUser={currentUser} />
      <main className="pt-nav-height"></main>
    </>
  );
}
