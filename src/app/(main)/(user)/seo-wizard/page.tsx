import type { Metadata } from "next";
import TrendingList from "./trending-list";

export const metadata: Metadata = {
  title: "SEO Wizard",
  description: "Optimize your content with SEO",
};

export default function SEOWizardPage() {
  return (
    <>
      <div className="pb-2 border-b-2">
        <h2 className="font-heading text-3xl">SEO Wizard</h2>
        <p className="text-muted-foreground">
          Optimize your content with keywords, tags, SEO, ...
        </p>
      </div>

      <TrendingList isTag={true} />
      <TrendingList isTag={false} />
    </>
  );
}
