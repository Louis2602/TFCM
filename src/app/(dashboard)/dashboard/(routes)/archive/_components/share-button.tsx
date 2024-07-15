import { useState } from "react";
import { share } from "@/lib/actions/content/share";
import { Share2, Clipboard } from "lucide-react"; // Assuming Clipboard is the icon for copying
import { toast } from "sonner";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

interface ShareButtonProps {
    contentId: string;
}

async function handleShare(contentId: string) {
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
}

const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
};

export default function ShareButton({ contentId }: ShareButtonProps) {
    const [link, setLink] = useState<string>(`${env.NEXT_PUBLIC_APP_URL}/share/${contentId}`);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="absolute top-2 right-2 text-primary p-2 rounded-full focus:outline-none cursor-pointer hover:text-primary/75 transition-colors"
                    variant="outline"
                    aria-label="Share"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="py-5">Share public link</DialogTitle>
                    <DialogDescription>
                        Your name, custom instructions, and any messages you add after sharing stay private.
                    </DialogDescription>
                    <DialogDescription>
                        <Input type="text" value={link} readOnly />
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="mr-auto">
                        <Button
                            onClick={() => copyToClipboard(link)}
                        >
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
