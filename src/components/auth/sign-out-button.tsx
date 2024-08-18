"use client";

import { signOut } from "@/app/(auth)/auth.action";
import { Icons } from "@/components/global/icons";
import { toast } from "sonner";

export const SignOutButton = () => {
  const onClick = () => {
    signOut();
    toast.success("See you again!");
  };
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 sm:gap-2 p-2 rounded-md hover:bg-border transition-colors duration-100 text-primary cursor-pointer"
    >
      <Icons.logout className="group-hover:text-primary sm:h-4 sm:w-4" />
      <p className="text-lg sm:text-sm">Logout</p>
    </button>
  );
};
