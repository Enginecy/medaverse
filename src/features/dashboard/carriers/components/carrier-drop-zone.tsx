"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { AddCarrierFormData } from "@/features/dashboard/carriers/schema/carrier-schema";
import { SquareArrowUp } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import styled from "styled-components";

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

export function CarrierDropzoneImageFormField({
  form,
  disabled = false,
}: {
  form: UseFormReturn<AddCarrierFormData>;
  disabled?: boolean;
}) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      disabled,
      // multiple: false,
      onDropAccepted(files) {
        const firstFile = files[0];
        if (firstFile) {
          form.setValue("carrierImage", firstFile);
        }
      },
      maxFiles: 1,
      maxSize: 1024 * 1024 * 5, // 5MB
    });

  return (
    <FormField
      control={form.control}
      name="carrierImage"
      render={() => {
        return (
          <FormItem>
            <FormControl>
              <div className="container">
                <Container
                  {...getRootProps({ isFocused, isDragAccept, isDragReject })}
                  style={{ 
                    opacity: disabled ? 0.5 : 1, 
                    cursor: disabled ? 'not-allowed' : 'pointer' 
                  }}
                >
                  <input {...getInputProps()} />
                  <SquareArrowUp className="text-primary" />
                  <p
                    className="text-foreground text-center text-sm
                      font-semibold"
                  >
                    {disabled ? "Upload disabled" : "Drag & drop or Upload"}
                  </p>
                  <p className="text-center text-sm text-neutral-500">
                    {disabled 
                      ? "You don't have permission to upload images" 
                      : "Supported formats: JPEG, JPG or PNG, max size 5MB"
                    }
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
