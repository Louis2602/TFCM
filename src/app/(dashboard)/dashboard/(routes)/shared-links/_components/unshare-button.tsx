import { unshare } from "@/lib/actions/content/share";
import { Trash2 } from "lucide-react";
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

interface UnshareButtonProps {
    contentId: string;
    onDelete: (contentId: string) => void;
}

async function handleUnshare(contentId: string) {
    try {
        const response = await unshare(contentId);
        if (!response.success) {
            throw new Error(response.message);
        }
        toast.success(response.message)
        return true;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default function UnshareButton({ contentId, onDelete }: UnshareButtonProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Trash2 color="red" className="hover:cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unshare link</AlertDialogTitle>
                    <AlertDialogDescription>
                        Do you want to unshare link to the content?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            handleUnshare(contentId).then((success) => {
                                if (success) {
                                    onDelete(contentId);
                                }
                            });
                        }}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
