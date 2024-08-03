import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Wizard",
  description: "Optimize your content with SEO",
};

export default function TemplatesPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-heading text-3xl">SEO Wizard</h2>
        <p className="text-muted-foreground">
          Optimize your content with keywords, tags, SEO, ...
        </p>
      </div>
    </>
  );
}
