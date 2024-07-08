'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import removeMarkdown from 'markdown-to-text';
import { Icons } from '@/components/global/icons';
import { IconButton } from '@/components/ui/button';
import { Hint } from '@/components/global/hint';
import { MarkdownRenderer } from '@/components/global/markdown';
import useAppStore from '@/lib/store';
import { Check, Copy, Download, PencilLine, Save, Trash2 } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { save } from '@/lib/actions/content/save';
import { toast } from 'sonner';

export const OutputBox = () => {
  const router = useRouter();
  const [setShowContent, content, setMarkdown] = useAppStore((state) => [
    state.setShowContent,
    state.content,
    state.setMarkdown,
  ]);
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
  });

  const pathname = usePathname();
  useEffect(() => {
    setMarkdown('');
  }, [pathname, setMarkdown]);

  const onClear = () => {
    if (!content.markdown) {
      return toast.info('Nothing to clear');
    }

    setMarkdown('');
    toast.success('Content is cleared');
  };

  const onDownload = () => {
    const fileName = 'content.md';
    const fileContent = content.markdown;

    if (!fileContent) {
      return toast.info('Nothing to download');
    }
    const blob = new Blob([fileContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Content is downloaded');
  };

  const onCopy = () => {
    if (isCopied || !content.markdown) {
      return toast.info('Nothing to copy');
    }
    const cleanText = removeMarkdown(content.markdown);
    copyToClipboard(cleanText);
    toast.success('Content is copy to clipboard');
  };

  const onEdit = async () => {
    if (!content.markdown) return null;
    window.localStorage.setItem('content', content.markdown);
    router?.push('/editor?initContent=true');
  };

  const handleFullscreen = () => {
    if (!content.markdown) return null;
    setShowContent(true);
  };

  const onSave = async () => {
    const fileContent = content.markdown;

    if (!fileContent) {
      return toast.info('Nothing to save');
    }
    const { success, message } = await save(fileContent);
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
    <div className="border rounded-lg w-full max-md:min-h-[30rem] max-h-[52rem] flex flex-col overflow-hidden">
      <div className="h-full px-3 py-2 text-sm overflow-auto">
        <MarkdownRenderer>{content.markdown}</MarkdownRenderer>
      </div>

      <div className="py-2 px-4 flex items-center justify-between bg-border/50">
        <div className="text-sm">
          <Hint label="Fullscreen">
            <Icons.maximize
              onClick={handleFullscreen}
              size={18}
              className="cursor-pointer"
            />
          </Hint>
        </div>
        <div className="flex gap-x-2">
          <IconButton tooltip="Clear">
            <Trash2 className="h-4 w-4" onClick={onClear} />
          </IconButton>
          <IconButton tooltip="Download" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </IconButton>
          <IconButton tooltip="Save">
            <Save className="h-4 w-4" onClick={onSave} />
          </IconButton>
          <IconButton tooltip="Copy" onClick={onCopy}>
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy content</span>
          </IconButton>
          <IconButton tooltip="Edit">
            <PencilLine className="h-4 w-4" onClick={onEdit} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
