"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { documents, type fileType } from "@/db/schema";
import type { UploadFileForm } from "@/features/dashboard/docs/schemas/upload-document-schema";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function uploadFileAction({
  file,
  name,
}: UploadFileForm): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return {
      success: false,
      error: {
        message: "User not authenticated",
        statusCode: 400,
        details: "Please log in to upload files.",
      },
    };
  }

  const bucket = supabase.storage.from("documents");
  const fileName = `${name}-${Date.now()}.${file.type.split("/")[1]}`;
  const path = `news/${fileName}`;

  const { error } = await bucket.upload(path, file);

  if (error) {
    return {
      success: false,
      error: {
        message: "Failed to upload file",
        statusCode: 400,
        details: error.message,
      },
    };
  }

  const db = await createDrizzleSupabaseClient();

  const result = await db.rls(async (tx) => {
    const type = file.name.split(
      ".",
    )[1] as (typeof fileType.enumValues)[number];

    //return insert the file information into the database to check on it below

    return await tx.insert(documents).values({
      category: "news",
      fileName: fileName,
      originalFileName: file.name,
      fileType: type,
      filePath: path,
      fileSize: BigInt(file.size),
      uploadedBy: user.user.id,
      title: name,
    });
  });

  if (!result) {
    await bucket.remove([path]);
    return {
      success: false,
      error: {
        message: "Failed to save file",
        statusCode: 400,
        details:
          "Could not save file information to the database. Please try again.",
      },
    };
  }

  return {
    success: true,
    data: undefined,
  };
}

export async function renameFileAction({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // First get the current file information
  const [currentDoc] = await db.rls(async (tx) => {
    return tx.select().from(documents).where(eq(documents.id, id)).limit(1);
  });

  if (!currentDoc) {
    throw {
      message: "File not found",
    };
  }

  // Generate new file name with the updated name
  const fileExtension = currentDoc.originalFileName.split(".").pop();
  const newFileName = `${name}-${Date.now()}.${fileExtension}`;
  const oldPath = currentDoc.filePath;
  const newPath = oldPath.replace(currentDoc.fileName, newFileName);

  // Move/rename the file in storage
  const bucket = supabase.storage.from("documents");
  // Move the file to the new path
  const { error: moveError } = await bucket.move(oldPath, newPath);
  if (moveError) {
    throw {
      message: "Failed to rename file",
    };
  }

  // Update database with new file information
  await db.rls(async (tx) => {
    await tx
      .update(documents)
      .set({
        title: name,
        fileName: newFileName,
        filePath: newPath,
      })
      .where(eq(documents.id, id));
  });

  return {
    message: "File renamed successfully",
  };
}

export async function deleteFileAction({ id }: { id: string }) {
  const supabase = await createClient();
  const db = await createDrizzleSupabaseClient();

  // First get the current file information
  const [currentDoc] = await db.rls(async (tx) => {
    return tx.select().from(documents).where(eq(documents.id, id)).limit(1);
  });

  if (!currentDoc) {
    throw {
      message: "File not found",
    };
  }

  // Delete the file from storage
  const bucket = supabase.storage.from("documents");
  const { error: deleteError } = await bucket.remove([currentDoc.filePath]);
  if (deleteError) {
    throw {
      message: "Failed to delete file from storage",
    };
  }

  // Delete the record from database
  await db.rls(async (tx) => {
    await tx.delete(documents).where(eq(documents.id, id));
  });

  return {
    message: "File deleted successfully",
  };
}
