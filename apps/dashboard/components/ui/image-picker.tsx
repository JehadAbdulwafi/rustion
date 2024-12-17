"use client";

import { ChangeEvent, useCallback, useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { API } from "@/api/axios";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface ImagePickerProps {
  defaultImage?: string | null;
  onImageChange: (url: string | null) => void;
  ratio?: number;
  placeholder?: string;
  className?: string;
}

export const ImagePicker = ({ 
  defaultImage,
  onImageChange,
  ratio = 16 / 9,
  placeholder = "Upload an image",
  className
}: ImagePickerProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(defaultImage ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (defaultImage !== undefined) {
      setImageUrl(defaultImage);
    }
  }, [defaultImage]);

  const handleImageUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isLoading) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = response.data;
      setImageUrl(uploadedUrl.url);
      onImageChange(uploadedUrl.url);
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onImageChange, toast, isLoading]);

  const handleRemoveImage = useCallback(() => {
    setImageUrl(null);
    onImageChange(null);
  }, [onImageChange]);

  return (
    <div className={className}>
      <AspectRatio ratio={ratio} className="bg-muted rounded-md overflow-hidden">
        {imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute z-10 p-2 rounded-full bg-destructive/80 hover:bg-destructive transition-colors right-3 top-3"
            >
              <X className="h-4 w-4 text-destructive-foreground" />
            </button>
          </div>
        ) : (
          <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors">
            <input
              type="file"
              className="sr-only"
              onChange={handleImageUpload}
              accept="image/*"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-center px-4 text-muted-foreground">
                {isLoading ? "Uploading..." : placeholder}
              </span>
            </div>
          </label>
        )}
      </AspectRatio>
    </div>
  );
};
