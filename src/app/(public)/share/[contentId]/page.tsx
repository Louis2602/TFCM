"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Unauthorized from "./_components/unauthorized";
import Error from "./_components/error";
import { MarkdownRenderer } from "@/components/global/markdown";
import { getContentById } from "@/lib/actions/content/share";

export default function SharedContent({ params }: any) {
  const { contentId } = params;
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await getContentById(contentId);

        if (!response.success) {
          if (response.message === "Unauthorized") {
            setError("Unauthorized");
          } else if (response.message === "Content not found") {
            setError("Not Found");
          } else {
            setError("Error");
          }
        } else {
          setContent(response.data);
        }
      } catch (err) {
        setError("Error");
      }
    }

    fetchContent();
  }, [contentId]);

  if (error === "Unauthorized") {
    return <Unauthorized />;
  }

  if (error === "Not Found") {
    notFound();
    return null;
  }

  if (error) {
    return <Error />;
  }

  if (!content) {
    return (
      <>
        <div className="flex h-screen w-screen justify-center items-center">
          <div>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <div className="h-max flex overflow-x-hidden justify-center">
      <div className="px-5 py-28 max-w-[768px] overflow-hidden">
        {content.body.split("\\n").map((str: string, idx: number) => (
          <MarkdownRenderer key={idx}>{str + "<br/>"}</MarkdownRenderer>
        ))}
      </div>
    </div>
  );
}
