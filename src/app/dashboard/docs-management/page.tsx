import type { Metadata } from "next";
import { redirect } from "next/navigation";


export default function DocsManagementPage() {
  redirect("/dashboard/docs-management/news");
}
