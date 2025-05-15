"use client";

import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, RefreshCw } from "lucide-react";
import { ImageUploader } from "@/components/image-uploader";

export function NineGridGenerator() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subImages, setSubImages] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    // 销毁之前的画布实例
    if (canvasInstance.current) {
      canvasInstance.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current);
    canvasInstance.current = canvas;
    const img = new fabric.Image(image, {
      left: 0,
      top: 0,
      angle: 0,
      opacity: 1,
    });

    canvas.add(img);
    canvas.setWidth(image.width);
    canvas.setHeight(image.height);
    canvas.renderAll();

    // 分割图片为9张子图
    const subWidth = image.width / 3;
    const subHeight = image.height / 3;
    const subImageUrls: string[] = [];

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = subWidth;
        tempCanvas.height = subHeight;
        const ctx = tempCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            image,
            x * subWidth,
            y * subHeight,
            subWidth,
            subHeight,
            0,
            0,
            subWidth,
            subHeight
          );
          subImageUrls.push(tempCanvas.toDataURL("image/png"));
        }
      }
    }

    setSubImages(subImageUrls);

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
        canvasInstance.current = null;
      }
    };
  }, [image]);

  const handleImageUpload = (file: File, preview: string) => {
    console.log("Image uploaded:", file.name);
    setImagePreview(preview);
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded:", img.width, img.height);
      setImage(img);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.src = preview;
  };

  const handleExportZip = () => {
    const zip = new JSZip();
    subImages.forEach((url, index) => {
      const data = url.split(",")[1];
      zip.file(`subimage_${index + 1}.png`, data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
      saveAs(content, "nine_grid_images.zip");
    });
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setSubImages([]);
  };

  if (!image) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <ImageUploader onImageUpload={handleImageUpload} customImageSrc="/ninegird.png" />
      </div>
    );
  }

  const imageContainerStyle = {
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-pink-200 dark:bg-pink-300 overflow-hidden">
            <div className="bg-black text-white text-center py-2 font-black text-xl">ORIGINAL IMAGE</div>
            <div style={imageContainerStyle} className="p-4">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          <div className="mt-4">
            <div
              className="w-full border-4 border-black p-3 bg-green-300 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex justify-center items-center"
              onClick={handleReset}
            >
              <div className="flex items-center">
                <RefreshCw className="mr-3 h-6 w-6 stroke-[3]" />
                <p className="text-black font-black text-xl">START OVER</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-blue-200 dark:bg-blue-300 overflow-hidden">
            <div className="bg-black text-white text-center py-2 font-black text-xl">NINE-GRID RESULT</div>
            <div style={imageContainerStyle} className="p-4">
              {subImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {subImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Subimage ${index + 1}`}
                      className="w-full h-auto border"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-black font-bold">Nine-Grid will appear here after processing</p>
                </div>
              )}
            </div>
          </div>
          {subImages.length > 0 && (
            <div className="mt-4">
              <div
                className="w-full border-4 border-black p-3 bg-cyan-300 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex justify-center items-center"
                onClick={handleExportZip}
              >
                <div className="flex items-center">
                  <Download className="mr-3 h-6 w-6 stroke-[3]" />
                  <p className="text-black font-black text-xl">DOWNLOAD ZIP</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}