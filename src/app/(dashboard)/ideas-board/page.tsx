import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas Board",
  description: "Kanban board to manage your brilliant ideas.",
};

export default function IdeasBoardPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-heading text-3xl">Ideas board</h2>
        <p className="text-muted-foreground">Managing your brilliant ideas.</p>
      </div>
    </>
  );
}
