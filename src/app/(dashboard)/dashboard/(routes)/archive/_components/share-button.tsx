import { share } from "@/lib/actions/content/share";
import { Share2, Clipboard } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

interface ShareButtonProps {
  contentId: string;
}

export default function ShareButton({ contentId }: ShareButtonProps) {
  const link = `${env.NEXT_PUBLIC_APP_URL}/share/${contentId}`;

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const handleShare = async (contentId: string) => {
    try {
      const response = await share(contentId);
      if (!response.success) {
        toast.error(response.message);
        throw new Error(response.message);
      }
      toast.success("Link sharing is turned on");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute top-2 right-2 text-primary p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <Share2 className="h-5 w-5" onClick={(e) => e.stopPropagation()} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="py-5">Share public link</DialogTitle>
          <DialogDescription>
            Your name, custom instructions, and any messages you add after
            sharing stay private.
          </DialogDescription>
          <DialogDescription>
            <Input type="text" value={link} readOnly />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mr-auto">
            <Button onClick={() => copyToClipboard(link)}>
              <Clipboard className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleShare(contentId);
            }}
          >
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
