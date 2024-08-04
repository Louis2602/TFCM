"use client";

import { useState } from "react";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCheck, Eye, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { Content } from "@/types/db";
import { ContentReviewStatus } from "./content-review-status";
import { FullscreenContent } from "@/components/dashboard/fullscreen-content";
import useAppStore from "@/lib/store";
import { ResponsiveDialog } from "@/components/global/responsive-dialog";
import { deleteContent } from "@/lib/actions/content/mutation";

interface CellActionProps {
  data: Content;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setShowContent, setMarkdown] = useAppStore((state) => [
    state.setShowContent,
    state.setMarkdown,
  ]);
  const [isPending, setIsPending] = useState(false);
  const onDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteContent(data.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleFullscreen = () => {
    setMarkdown(data.body);
    setShowContent(true);
  };
  return (
    <>
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Review content of collaborators"
        description="Choose the final status for this content"
      >
        <ContentReviewStatus initialStatus={data.status!} contentId={data.id} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={handleFullscreen}>
            <div className="flex transition-all hover:bg-muted items-center gap-2 w-full rounded-md">
              <Eye className="h-4 w-4" /> View
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className="flex transition-all hover:bg-muted items-center gap-2 w-full rounded-md"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <CheckCheck className="h-4 w-4" /> Review
            </div>
          </DropdownMenuItem>
          <ConfirmModal
            header="Delete this content?"
            description="This will delete this content completely"
            disabled={isPending}
            onConfirm={onDelete}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
      <FullscreenContent />
    </>
  );
};
