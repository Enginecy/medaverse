import { DataTable } from "@/features/dashboard/docs/datatable/data-table";
import { columns } from "@/features/dashboard/docs/datatable/columns";
import type { Document } from "@/features/dashboard/docs/datatable/columns";

export default function NewsPage() {
  const docs: Document[] = [
    {
      id: "1",
      fileName: "Document 1",
      type: "PDF",
      size: 16300,
      uploadedBy: "John Doe",
      submittedDate: new Date(),
    },
    {
      id: "2",
      fileName: "Document 2",
      type: "PDF",
      size: 100,
      uploadedBy: "Jane Doe",
      submittedDate: new Date(),
    },
  ];
  return <DataTable columns={columns} data={docs} searchKey="fileName" />;
}
