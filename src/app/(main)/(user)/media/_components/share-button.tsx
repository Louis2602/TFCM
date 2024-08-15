import { share } from "@/lib/actions/content/share";
import { Share2, Copy } from "lucide-react";
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
import { Label } from "@/components/ui/label";

interface ShareButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

export default function ShareButton({ open, onOpenChange, contentId }: ShareButtonProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="py-5">Share public link</DialogTitle>
          <DialogDescription>
            Your name, custom instructions, and any messages you add after
            sharing stay private.
          </DialogDescription>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input type="text" value={link} readOnly />
            </div>
            <Button onClick={() => copyToClipboard(link)}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <DialogFooter>
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
