"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getDownloadLink,
  type NewsDocument,
} from "@/features/dashboard/docs/server/db/docs";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { RenameFileDialogTrigger } from "@/features/dashboard/docs/components/modals/rename-file-dialog";
import { useShowDialog } from "@/lib/react-utils";
import { DeleteDialog } from "@/components/delete-dialog";
import { deleteFileAction } from "@/features/dashboard/docs/server/actions/docs";
import { toast } from "sonner";

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

export const columns: ColumnDef<NewsDocument>[] = [
  {
    accessorKey: "title",
    header: "File Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.title}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "file_type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={getTypeColor(row.original.file_type)}
        >
          {row.original.file_type.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "file_size",
    header: "Size",
    cell: ({ row }) => <p>{formatFileSize(Number(row.original.file_size))}</p>,
  },
  {
    accessorKey: "uploaded_by",
    header: "Uploaded By",
    cell: ({ row }) => {
      return <UserChip user={row.original.uploaded_by} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "Submitted Date",
    cell: ({ row }) => (
      <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
    ),
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
            <RenameFileDialogTrigger
              fileId={document.id}
              currentName={document.file_name}
              canUpdate={document.can_update}
            />
            <DropdownMenuItem
              onClick={async () => {
                window.open(
                  await getDownloadLink(document.file_path),
                  "_blank",
                );
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DeleteFileDialogTrigger
              fileId={document.id}
              canDelete={document.can_delete}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DeleteFileDialogTrigger({
  fileId,
  canDelete,
}: {
  fileId: string;
  canDelete: boolean;
}) {
  const showDialog = useShowDialog();

  const handleClick = () => {
    showDialog((resolve) => (
      <DeleteDialog
        onSubmit={deleteFileAction}
        title="Delete File"
        content="Are you sure you want to delete this file?"
        onCancel={() => resolve(false)}
        onSuccess={() => {
          toast.success("File deleted successfully");
          resolve(true);
        }}
        variables={{ id: fileId }}
      />
    ));
  };

  return (
    <DropdownMenuItem
      disabled={!canDelete}
      className="text-destructive"
      onClick={handleClick}
    >
      <Trash2 className="text-destructive mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  );
}
