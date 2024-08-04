import React, { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateContentStatus } from "@/lib/actions/content/mutation";
import { ReviewStatus } from "@/types/db";
import { toast } from "sonner";

export const ContentReviewStatus = ({
  initialStatus,
  contentId,
}: {
  initialStatus: ReviewStatus;
  contentId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ReviewStatus>(initialStatus);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await updateContentStatus(status, contentId, comment);
        if (!result.success) {
          toast.error(`Failed to update status: ${result?.error}`);
        } else {
          toast.success("Review submitted successfully");
          setComment("");
        }
      } catch (error: any) {
        toast.error(`Error updating status: ${error}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as ReviewStatus)}
        disabled={isPending}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending" disabled>
            Pending
          </SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
          <SelectItem value="declined">Declined</SelectItem>
        </SelectContent>
      </Select>
      {status !== "pending" && (
        <Textarea
          placeholder="Add your review comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isPending}
          className="min-h-[100px] w-full resize-none"
          rows={5}
          maxLength={1000}
        />
      )}
      <Button
        type="submit"
        disabled={isPending || status === initialStatus}
        className="w-full"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ContentReviewStatus;
