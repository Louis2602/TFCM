import { redirect } from "next/navigation";
import { UpdateProfileForm } from "@/components/dashboard/account/update-profile-form";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/lucia";
import { AppearanceForm } from "@/components/dashboard/settings/appearance-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/");

  return (
    <>
      <div className="mb-8 pb-4 border-b border-border/50">
        <h2 className="font-heading text-3xl">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <div className="flex md:flex-row flex-col">
        <div className="flex-1 flex flex-col gap-4">
          <UpdateProfileForm currentUser={currentUser} />
          <AppearanceForm />
        </div>
        <div className="flex-1" />
      </div>
    </>
  );
}
