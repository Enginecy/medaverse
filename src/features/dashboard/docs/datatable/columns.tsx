"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Document {
  id: string;
  fileName: string;
  type: string;
  size: number;
  uploadedBy: string;
  submittedDate: Date;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "pdf":
      return "bg-red-100 text-red-800";
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-800";
    case "xls":
    case "xlsx":
      return "bg-green-100 text-green-800";
    case "jpg":
    case "jpeg":
    case "png":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.fileName}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className={getTypeColor(row.original.type)}>
          {row.original.type.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => <p>{formatFileSize(row.original.size)}</p>,
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
    cell: ({ row }) => {
      return <Badge variant="secondary">{row.original.uploadedBy}</Badge>;
    },
  },
  {
    accessorKey: "submittedDate",
    header: "Submitted Date",
    cell: ({ row }) => <p>{row.original.submittedDate.toLocaleDateString()}</p>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const document = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
