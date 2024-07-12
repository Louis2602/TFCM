import type { Metadata } from "next";
import SharedLinksComponent from "./_components/get-shared-links";

export const metadata: Metadata = {
  title: "Shared Links",
  description: "Manage share links",
};

export default function IdeasBoardPage() {
  return (
    <>
      <div className="mb-6 pb-4 border-b border-border/50">
        <h2 className="font-heading text-3xl">Shared Links</h2>
        <p className="text-muted-foreground">Managing your shared links.</p>
      </div>
      <div>
        <SharedLinksComponent />
      </div>
    </>
  );
}
