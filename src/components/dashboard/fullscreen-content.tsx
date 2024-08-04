"use client";

import { useLockBody } from "@/hooks/use-lock-body";
import { Icons } from "@/components/global/icons";
import { MarkdownRenderer } from "@/components/global/markdown";
import useAppStore from "@/lib/store";

export const FullscreenContent = () => {
  const [setShowContent, content] = useAppStore((state) => [
    state.setShowContent,
    state.content,
  ]);
  useLockBody(content.showContent);

  const handleCloseFullscreen = () => setShowContent(false);

  if (content.showContent && content.markdown)
    return (
      <div
        onClick={handleCloseFullscreen}
        className="fixed inset-0 w-full h-full bg-background/50 backdrop-blur-md flex items-center justify-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-background w-full md:w-3/4 lg:w-1/2 h-full p-4 text-sm border-l border-r border-border/50 overflow-auto"
        >
          <div className="pb-4 flex justify-end">
            <Icons.close
              onClick={handleCloseFullscreen}
              className="cursor-pointer"
            />
          </div>
          <MarkdownRenderer>{content.markdown}</MarkdownRenderer>
        </div>
      </div>
    );
};
