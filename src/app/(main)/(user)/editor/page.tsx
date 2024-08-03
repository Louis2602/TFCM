"use client";

import Editor from "@/components/editor/editor";
import { useSearchParams } from "next/navigation";
import { JSONContent } from "novel";

const EditorPage = () => {
  const searchParams = useSearchParams();
  const initContent = searchParams.get("initContent");

  return (
    <>
      <div className="mb-4">
        <h2 className="font-heading text-3xl">Content Editor</h2>
        <p className="text-muted-foreground">
          A powerful AI Editor for writing your content
        </p>
      </div>

      <Editor
        initContent={
          initContent
            ? ((window.localStorage.getItem("content") ??
                "") as unknown as JSONContent)
            : {}
        }
      />
    </>
  );
};

export default EditorPage;
