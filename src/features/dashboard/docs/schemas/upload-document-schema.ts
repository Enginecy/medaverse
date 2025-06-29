import z from "zod";

export const uploadFileSchema = z.object({
  file: z.instanceof(File),
  name: z.string(),
});
export type UploadFileForm = z.infer<typeof uploadFileSchema>;
