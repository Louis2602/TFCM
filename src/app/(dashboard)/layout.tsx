import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/dashboard/account/user-profile";
import { MobileNavigation } from "@/components/dashboard/navigation";
import { Navigation } from "@/components/dashboard/navigation";
import { Icons } from "@/components/global/icons";
import { FullscreenContent } from "@/components/dashboard/fullscreen-content";
import { Hint } from "@/components/global/hint";
import { getCurrentUser } from "@/lib/lucia";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/");

  return (
    <>
      <main className="flex overflow-hidden h-screen w-screen">
        <aside className="lg:visible lg:relative absolute invisible max-w-[13.75rem] w-full border-r border-border/50 py-3 px-4 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-6 my-3">
            <UserProfile currentUser={currentUser} />
            <Hint label="Buy credits">
              <Link href="/dashboard/credits">
                <Icons.coins className="text-yellow-500 hover:text-yellow-500/70 transition-colors duration-200" />
              </Link>
            </Hint>
          </div>
          <Navigation />
        </aside>
        <div className="w-full flex flex-col lg:flex-row">
          <div className="lg:hidden border-b border-border/50 px-6 py-4 flex items-center justify-between">
            <MobileNavigation />
            <UserProfile currentUser={currentUser} />
          </div>
          <section className="relative p-6 w-full h-full">{children}</section>
        </div>
      </main>
      <FullscreenContent />
    </>
  );
}
