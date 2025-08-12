"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileBox,
  FileIcon,
  FileSpreadsheet,
  FileText,
  SquareArrowUp,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useForm, type UseFormReturn } from "react-hook-form";
import styled from "styled-components";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  uploadFileSchema,
  type UploadFileForm,
} from "@/features/dashboard/docs/schemas/upload-document-schema";
import { useMutation } from "@tanstack/react-query";
import { uploadFileAction } from "@/features/dashboard/docs/server/actions/docs";
import { PulseMultiple } from "react-svg-spinners";
import { showSonnerToast } from "@/lib/react-utils";

type ThumbnailData = {
  data?: string;
  type: "pdf" | "spreadsheet" | "word" | "powerpoint" | "other";
};

export function UploadFileDialog({
  resolve,
}: {
  resolve: (value: boolean) => void;
}) {
  const [thumbnail, setThumbnail] = useState<ThumbnailData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const form = useForm<UploadFileForm>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: new File([], ""),
      name: "",
    },
  });

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (data: UploadFileForm) => {
      const result = await uploadFileAction(data);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },
    onSuccess: () => {
      showSonnerToast({
        message: "File uploaded successfully",
        type: "success",
        description: "Your file has been uploaded successfully.",
      });
      resolve(true);
    },
    onError: (error) => {
      showSonnerToast({
        message: "Failed to upload file",
        type: "error",
        description: error.message ?? "Something went wrong, please try again.",
      })
    },
  });

  const onSubmit = (values: UploadFileForm) => {
    uploadFile(values);
  };

  const IconType = ({ type }: { type: string }) => {
    switch (type) {
      case "spreadsheet":
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      case "word":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "powerpoint":
        return <FileBox className="h-8 w-8 text-orange-600" />;
      case "other":
        return <FileIcon className="h-8 w-8 text-gray-600" />;
      default:
        break;
    }
  };

  const generateThumbnail = async (file: File) => {
    try {
      let type: ThumbnailData["type"] = "other";
      if (file.type === "application/vnd.ms-excel") {
        type = "spreadsheet";
      } else if (
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        type = "word";
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        type = "powerpoint";
      } else if (file.type === "application/pdf") {
        type = "pdf";
      }

      if (type !== "pdf") {
        setThumbnail({ data: undefined, type });
        return;
      }

      const pdfjsLib = await import("pdfjs-dist");

      // Set worker path for Next.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true,
      }).promise;

      // Get first page
      const page = await pdf.getPage(1);

      // Set canvas dimensions for thumbnail
      const viewport = page.getViewport({ scale: 0.8 });
      const canvas = canvasRef.current;

      if (!canvas) return;

      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page
      const renderContext = {
        canvasContext: context!,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");
      setThumbnail({ data: dataUrl, type: "pdf" });
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  };

  const hasFile = (form.watch("file") as File)?.size > 0;

  return (
    <DialogContent className="w-[500px] pt-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {hasFile ? (
            <div className="relative">
              <div
                className="mx-auto flex h-48 w-full max-w-md flex-col
                  items-center justify-center rounded-lg border-2 border-dashed
                  border-gray-300 bg-gray-50 p-6"
              >
                <div className="relative mb-4 h-36 w-36 rounded-full p-3">
                  {thumbnail?.data ? (
                    <Image
                      src={thumbnail.data!}
                      alt="PDF Thumbnail"
                      className="max-h-full max-w-full object-cover"
                      fill
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                    >
                      <IconType type={thumbnail?.type ?? "other"} />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="mb-1 text-sm font-medium text-gray-900">
                    {form.watch("file")?.name || "Selected file"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {form.watch("file")?.size
                      ? `${(form.watch("file").size / 1024 / 1024).toFixed(2)} MB`
                      : "File size"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => form.setValue("file", new File([], ""))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <DropzoneFileFormField
              form={form}
              onFileChange={generateThumbnail}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grow" />
          <DialogFooter className="items-end justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <PulseMultiple color="white" /> : "Upload"}
            </Button>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </Form>
      <canvas ref={canvasRef} className="hidden" />
    </DialogContent>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getColor = (props: any) => {
  if (props.isDragAccept) {
    return "#00c951";
  }
  if (props.isDragReject) {
    return "var(--destructive)";
  }
  if (props.isFocused) {
    return "var(--primary-500)";
  }
  return "var(--input)";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

function DropzoneFileFormField({
  form,
  onFileChange,
}: {
  form: UseFormReturn<UploadFileForm>;
  onFileChange: (file: File) => void;
}) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "application/pdf": [],
        "application/msword": [],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [],
        "application/vnd.ms-excel": [],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
        "application/vnd.ms-powerpoint": [],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
          [],
      },
      // multiple: false,
      onDropAccepted(files) {
        const firstFile = files[0];
        if (firstFile) {
          form.setValue("file", firstFile);
          onFileChange(firstFile);
        }
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 5, // 5MB
    });

  return (
    <FormField
      control={form.control}
      name="file"
      render={() => {
        return (
          <FormItem>
            <FormControl>
              <div className="container">
                <Container
                  {...getRootProps({ isFocused, isDragAccept, isDragReject })}
                >
                  <input {...getInputProps()} />
                  <SquareArrowUp className="text-primary" />
                  <p
                    className="text-foreground text-center text-sm
                      font-semibold"
                  >
                    Drag & drop or Upload
                  </p>
                  <p className="text-center text-sm text-neutral-500">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, max
                    size 10MB
                  </p>
                </Container>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
