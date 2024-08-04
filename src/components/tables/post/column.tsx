"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Content } from "@/types/db";
import { format } from "date-fns";

const Status = ({ status }: any) => {
  let colorClass = "";

  switch (status.toLowerCase()) {
    case "pending":
      colorClass = "bg-yellow-200 text-yellow-800";
      break;
    case "accepted":
      colorClass = "bg-green-200 text-green-800";
      break;
    case "declined":
      colorClass = "bg-red-200 text-red-800";
      break;
    default:
      colorClass = "bg-gray-200 text-gray-800";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

export const columns: ColumnDef<Content>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "body",
    header: "BODY",
    cell: ({ row }) => (
      <span className="line-clamp-3 max-w-2xl">{row.getValue("body")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => <Status status={row.getValue("status")} />,
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ renderValue, ...props }) => {
      const value = renderValue() as string;
      const formattedDate = format(new Date(value), "MMMM d, yyyy - HH:mm:ss");
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
