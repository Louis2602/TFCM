"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors={true} expand={true} position="top-right" />
      </ThemeProvider>
    </>
  );
}
