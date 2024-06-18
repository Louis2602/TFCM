import Editor from "@/components/editor/editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description: "An AI power-based editor for writing content",
};

const EditorPage = () => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="font-heading text-3xl">AI Editor</h2>
        <p className="text-muted-foreground">
          A powerful AI-based editor for writing your content
        </p>
      </div>
      <Editor />
    </div>
  );
};

export default EditorPage;
