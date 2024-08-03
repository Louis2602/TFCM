"use client";

import { useState } from "react";
import { Icons } from "@/components/global/icons";
import { CategoryForm } from "./category-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { ConfirmDialog } from "../../../../../../../components/global/confirm-dialog";
import { Category } from "@/types/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
  onClick: () => void;
  data: Category;
  isSelected?: boolean;
  editFunction?: {
    onDelete: (id: string) => void;
    onUpdate: (id: string, title: string) => void;
  };
}

const CategoryCard = (props: CategoryCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  const f = props.editFunction;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle
          className="truncate w-[300px] hover:text-primary transition-colors cursor-pointer"
          onClick={props.onClick}
        >
          {props.data.name}
        </CardTitle>

        {f && (
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Ellipsis />
                <span className="sr-only">Edit category</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUpdateForm(true);
                }}
              >
                <Icons.edit className="h-5 w-5" /> Update
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={() => {}}>
                <Icons.share className="h-5 w-5" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialog(true);
                }}
              >
                <Icons.trash className="h-5 w-5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {f && (
        <>
          <CategoryForm
            open={isUpdateForm && !isDropdownOpen}
            onOpenChange={(open) => {
              setIsUpdateForm(open);
              setTimeout(() => {
                if (!open) {
                  document.body.style.pointerEvents = "";
                }
              }, 100);
            }}
            type="Update"
            currentName={props.data.name}
            onSubmit={(values) => {
              f.onUpdate(props.data.id, values.name);
            }}
          />
          <ConfirmDialog
            open={isDeleteDialog && !isDropdownOpen}
            onOpenChange={(open) => {
              setIsDeleteDialog(open);
              setTimeout(() => {
                if (!open) {
                  document.body.style.pointerEvents = "";
                }
              }, 100);
            }}
            title={'Delete "' + props.data.name + '"?'}
            variant="destructive"
            confirmText="Delete"
            onConfirm={() => {
              f.onDelete(props.data.id);
            }}
          />
        </>
      )}
    </Card>
  );
};

export default CategoryCard;
