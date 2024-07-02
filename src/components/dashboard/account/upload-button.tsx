"use client";

import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import { Loader } from "@/components/global/loader";
import { onUpload } from "@/components/editor/image-upload";
import { useState } from "react";

interface UploadButtonProps {
  form: UseFormReturn;
  onUploadComplete: (url: string) => void;
}

export const UploadButton = ({ form, onUploadComplete }: UploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return null;

    const selectedFile = e.currentTarget.files[0];

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile?.type)) {
      return form.setError("imageUrl", {
        message: "Only .png, .jpeg, and .webp file types are allowed",
      });
    } else if (selectedFile.size / 1024 / 1024 > 20) {
      return form.setError("imageUrl", {
        message: "File size too big (max 20MB).",
      });
    }
    setIsUploading(true);
    const imageUrl = await onUpload(selectedFile);
    setIsUploading(false);

    onUploadComplete(imageUrl as string);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="relative w-fit"
      disabled={isUploading}
    >
      <label className="absolute inset-0 w-full h-full cursor-pointer">
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
      {isUploading && <Loader />}
      Change photo
    </Button>
  );
};
