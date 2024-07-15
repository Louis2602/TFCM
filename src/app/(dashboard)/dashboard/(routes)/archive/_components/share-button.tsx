import { useState } from "react";
import { share } from "@/lib/actions/content/share";
import { Share2, Clipboard } from "lucide-react"; // Assuming Clipboard is the icon for copying
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareButtonProps {
    contentId: string;
}

async function handleShare(contentId: string, setLink: (link: string) => void) {
    try {
        const response = await share(contentId);
        if (!response.success) {
            toast.error(response.message);
            throw new Error(response.message);
        }
        setLink(`/share/${contentId}`);
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
    const [link, setLink] = useState<string>('');

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="absolute top-2 right-2 text-primary p-2 rounded-full focus:outline-none cursor-pointer hover:text-primary/75 transition-colors"
                    variant="outline"
                    aria-label="Share"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Share2 className="h-5 w-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Share public link</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your name, custom instructions, and any messages you add after sharing stay private.
                    </AlertDialogDescription>
                    <AlertDialogDescription>
                        <Input type="text" value={`https://tfcm-git-develop-norax.vercel.app/share/${contentId}`} placeholder={`https://tfcm-git-develop-norax.vercel.app/share/${contentId}`} readOnly />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="flex-1"> {/* Ensures the copy button stays on the leftmost side */}
                        <Button
                            onClick={() => copyToClipboard(`https://tfcm-git-develop-norax.vercel.app/share/${contentId}`)}
                        >
                            <Clipboard className="h-5 w-5" />
                        </Button>
                    </div>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevent the dialog from closing
                            handleShare(contentId, setLink);
                        }}
                    >
                        Share
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
