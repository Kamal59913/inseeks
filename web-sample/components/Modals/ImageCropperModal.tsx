"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";

interface ImageCropperModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  modal,
  onClose,
}) => {
  const { image, onCropComplete, aspectRatio = 1 } = modal.data as any;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const shouldPreserveTransparency =
      imageSrc.startsWith("data:image/svg+xml") ||
      imageSrc.startsWith("data:image/png") ||
      imageSrc.startsWith("data:image/webp");
    const outputMimeType = shouldPreserveTransparency
      ? "image/png"
      : "image/jpeg";

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // JPEG has no alpha channel, so transparent areas can turn black unless
    // we paint an explicit background first.
    if (!shouldPreserveTransparency) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, outputMimeType);
    });
  };

  const handleApply = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] h-[600px] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 bg-gray-50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            showGrid={false}
          />
        </div>

        <div className="p-4 bg-white space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          
          <DialogFooter className="flex sm:justify-between items-center">
            <Button variant="outline" onClick={onClose} className="px-8 rounded-md">
              Cancel
            </Button>
            <Button onClick={handleApply} className="hover:bg-primary/90 px-8 rounded-md">
              Apply 
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
