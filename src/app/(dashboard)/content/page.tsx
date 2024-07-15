import type { Metadata } from "next";
import { ContentGenerator } from "./content-generator";

export const metadata: Metadata = {
  title: "Content Management",
  description: "Write like a pro, everywhere you write.",
};

export default function ContentPage() {
  return (
    <div className="h-full w-full">
      <ContentGenerator />
    </div>
  );
}
