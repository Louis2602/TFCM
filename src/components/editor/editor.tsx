'use client';

import React, { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorInstance,
  EditorCommandList,
} from 'novel';
import { ImageResizer, handleCommandNavigation } from 'novel/extensions';
import { defaultExtensions } from './extensions';
import { Separator } from '@/components/ui/separator';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { ColorSelector } from './selectors/color-selector';
import { TextButtons } from './selectors/text-buttons';
import { slashCommand, suggestionItems } from './slash-command';
import { handleImageDrop, handleImagePaste } from 'novel/plugins';
import { uploadFn } from './image-upload';
import AIMenuSwitch from './ai/ai-menu-switch';
import { Markdown } from 'tiptap-markdown';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { save } from '@/lib/actions/content/save';
import { toast } from 'sonner';

const extensions = [...defaultExtensions, slashCommand, Markdown];

interface EditorProps {
  initContent?: JSONContent;
  className?: string;
}

const Editor = ({ initContent = {}, className }: EditorProps) => {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [content, setContent] = useState<JSONContent>(initContent);
  const [contentMD, setContentMD] = useState(
    window.localStorage.getItem('content')
  );

  const debouncedUpdates = useDebounceCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      const contentJson = JSON.stringify(json);
      const markdownOutput = editor.storage.markdown.getMarkdown();
      window.localStorage.setItem('novel-content', contentJson);
      setContent(json);
      setContentMD(markdownOutput);
      setSaveStatus('Saved');
    },
    1000
  );

  const handleSaveContent = async () => {
    const { success, message } = await save(
      String(contentMD).replace(/\n/g, '\\n')
    );
    if (!success) {
      toast.error('Oops, an error has occured', {
        description: message,
      });
    }
    toast.success('Save to archive', {
      description: message,
    });
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
        {saveStatus}
      </div>
      <EditorRoot>
        <ScrollArea className="sm:border border sm:rounded-lg py-4 shadow-sm">
          <EditorContent
            initialContent={content}
            extensions={extensions}
            className="relative h-[750px] w-full bg-background p-6 overflow-auto"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view: any, event: any) =>
                  handleCommandNavigation(event),
              },
              handlePaste: (view: any, event: any) =>
                handleImagePaste(view, event, uploadFn),
              handleDrop: (view: any, event: any, _slice: any, moved: any) =>
                handleImageDrop(view, event, moved, uploadFn),
              attributes: {
                class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onUpdate={({ editor }: any) => {
              debouncedUpdates(editor);
              setSaveStatus('Unsaved');
            }}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">
                No results
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command!(val)}
                    className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            <AIMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </AIMenuSwitch>
          </EditorContent>
        </ScrollArea>
      </EditorRoot>

      <Button onClick={() => handleSaveContent()}>Save</Button>
    </div>
  );
};

export default Editor;
