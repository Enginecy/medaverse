"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, FileText, FileBox, FileIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function NewsCard({ title, file }: { title: string; file: string }) {
  const [thumbnail, setThumbnail] = useState<ThumbnailData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateThumbnail = useCallback(
    async (file: File | string) => {
      // if file is a string, then it is a url load it as a blob
      if (typeof file === "string") {
        try {
          const response = await fetch(file);
          const blob = await response.blob();
          file = new File([blob], file);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }

      try {
        const type = getFileType(file);

        if (type !== "pdf") {
          setThumbnail({ data: undefined, type });
          return;
        }

        const pdfjsLib = await import("pdfjs-dist");

        // Set worker path for Next.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const arrayBuffer = await (file as File).arrayBuffer();
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
    },
    [canvasRef],
  );

  useEffect(() => {
    generateThumbnail(file);
  }, [file, generateThumbnail, canvasRef]);

  return (
    <Card
      className="hover:bg-card/5 h-64 w-96 py-0 hover:cursor-pointer"
      onClick={() => {
        window.open(file, "_blank");
      }}
    >
      <CardContent className="flex h-full w-full flex-col p-2">
        {thumbnail?.data ? (
          <img
            src={thumbnail.data}
            alt={title}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconType type={thumbnail?.type ?? "other"} />
          </div>
        )}
        <p className="px-4 pt-2 text-lg font-medium">{title}</p>
      </CardContent>
      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}

type ThumbnailData = {
  data?: string;
  type: "pdf" | "spreadsheet" | "word" | "powerpoint" | "other";
};

function getFileType(file: File | string) {
  let type = typeof file === "string" ? file : file.type;
  if (type == "") {
    // extract from url
    const url = new URL((file as File).name);
    const extension = url.pathname.split(".").pop();
    type = extension ?? "";
  }
  let result: ThumbnailData["type"] = "other";
  if (
    type === "application/vnd.ms-excel" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "xlsx" ||
    type === "xls"
  ) {
    result = "spreadsheet";
  } else if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type === "docx" ||
    type === "doc"
  ) {
    result = "word";
  } else if (
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    type === "pptx"
  ) {
    result = "powerpoint";
  } else if (type === "application/pdf" || type === "pdf") {
    result = "pdf";
  }
  return result;
}

function IconType({ type }: { type: ThumbnailData["type"] }) {
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
}
