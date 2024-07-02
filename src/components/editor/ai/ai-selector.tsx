"use client";

import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useEditor } from "novel";
import { useState } from "react";
import Markdown from "react-markdown";
import AISelectorCommands from "./ai-selector-commands";
import AICompletionCommands from "./ai-completion-command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowUp, Wand2 } from "lucide-react";
import { addAIHighlight } from "novel/extensions";
import { Loader } from "@/components/global/loader";

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ open, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate/editor",
    onResponse: (response: Response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
    },
    onError: (e: any) => {
      toast.error(e.message);
    },
  });

  const hasCompletion = completion.length > 0;

  return (
    <Command className="w-[350px]">
      <CommandList>
        {hasCompletion && (
          <div className="flex max-h-[400px]">
            <ScrollArea>
              <div className="prose p-2 px-4 prose-sm">
                <Markdown>{completion}</Markdown>
              </div>
            </ScrollArea>
          </div>
        )}

        {isLoading && (
          <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground">
            <Wand2 className="mr-2 h-4 w-4 shrink-0" />
            AI is thinking
            <Loader className="w-4 h-4 ml-2" />
          </div>
        )}
        {!isLoading && (
          <>
            <div className="relative">
              <CommandInput
                value={inputValue}
                onValueChange={setInputValue}
                autoFocus
                placeholder={
                  hasCompletion
                    ? "Tell AI what to do next"
                    : "Ask AI to edit or generate..."
                }
                onFocus={() => addAIHighlight(editor!)}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
                onClick={() => {
                  if (completion)
                    return complete(completion, {
                      body: {
                        option: "zap",
                        command: inputValue,
                      },
                    }).then(() => setInputValue(""));

                  const text = editor?.state.doc.textBetween(
                    editor.state.selection.from,
                    editor.state.selection.to,
                    " ",
                  )!;

                  complete(text, {
                    body: {
                      option: "zap",
                      command: inputValue,
                    },
                  }).then(() => setInputValue(""));
                }}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            {hasCompletion ? (
              <AICompletionCommands
                onDiscard={() => {
                  editor?.chain().unsetHighlight().focus().run();
                  onOpenChange(false);
                }}
                completion={completion}
              />
            ) : (
              <AISelectorCommands
                onSelect={(value, option) =>
                  complete(value, { body: { option } })
                }
              />
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
}
