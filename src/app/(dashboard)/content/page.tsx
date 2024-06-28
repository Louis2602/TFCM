import type { Metadata } from "next";
import { ContentGenerator } from "./content-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@/components/editor/editor";

export const metadata: Metadata = {
  title: "Content Management",
  description: "Write like a pro, everywhere you write.",
};

export default function ContentPage() {
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="generator" className="h-full">
        <TabsList className="grid grid-cols-2 mb-8 w-[400px]">
          <TabsTrigger value="generator">Generator</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="h-full">
          <ContentGenerator />
        </TabsContent>
        <TabsContent value="editor" className="h-full">
          <Editor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
