import type { Metadata } from "next";
import { ContentWriter } from "./content-writer";

export const metadata: Metadata = {
  title: "Content Writer",
  description: "Write like a pro, everywhere you write.",
};

export default function ContentWriterPage() {
  return <ContentWriter />;
}
