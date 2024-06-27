"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfileSchema } from "@/lib/validations/profile";
import { generateFallback } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { UploadButton } from "@/components/dashboard/account/upload-button";
import type { User } from "@/types/db";
import { updateUserImage, updateUserProfile } from "@/lib/actions/user";
import { Loader } from "@/components/global/loader";
import { Label } from "@/components/ui/label";

interface UpdateProfileProps {
  currentUser: User;
}

type FormData = z.infer<typeof updateProfileSchema>;

export const UpdateProfileForm = ({ currentUser }: UpdateProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (formData: FormData) => {
    const formValues = form.getValues();
    const allValuesFalsy = Object.values(formValues).every((value) => !value);

    if (allValuesFalsy) return null;

    setIsLoading(true);

    const { success, message } = await updateUserProfile(formData);

    if (!success) {
      setIsLoading(false);
      return toast.error("Profile not updated", {
        description: message,
      });
    }
    toast.success(message);

    setIsLoading(false);
  };

  const onUploadComplete = async (url: string) => {
    const { success, message } = await updateUserImage(url);

    if (!success) {
      return toast.error("Profile image not updated", {
        description: message,
      });
    }
    toast.success(message);

    setProfilePicture(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="picture"
          render={() => (
            <div className="inline-flex flex-col gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={profilePicture || currentUser.picture || ""}
                  alt={currentUser.name || ""}
                />
                <AvatarFallback>
                  {generateFallback(`${currentUser.name}`)}
                </AvatarFallback>
              </Avatar>
              <UploadButton form={form} onUploadComplete={onUploadComplete} />
              <FormMessage />
            </div>
          )}
        />
        <div className="flex md:items-start flex-col md:flex-row md:justify-between gap-6">
          <div className="w-full">
            <Label>Email</Label>
            <Input value={currentUser.email} disabled className="mt-2" />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} value={currentUser.name} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader />}
          Update profile
        </Button>
      </form>
    </Form>
  );
};
