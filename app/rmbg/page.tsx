"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ImageUploader } from "@/components/image-uploader"
import { processImageBackground } from "@/lib/backgroundRemoval"
import { RefreshCw, Download } from "lucide-react"

export default function RemoveBackgroundPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (file: File, preview: string) => {
    setImageFile(file)
    setImagePreview(preview)
    setProcessedImageUrl(null)
    setError(null)
    processImage(file)
  }

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true)
      setError(null)
      const url = await processImageBackground(file)
      setProcessedImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove background")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImageUrl || !imageFile) return;

    // 获取原始文件名（不含扩展名）
    const originalFileName = imageFile.name.split('.')[0] || 'image';
    const downloadFileName = `${originalFileName}_removed_background.png`; // 或者其他格式，取决于处理结果

    // 使用 fetch 获取 Blob 数据
    fetch(processedImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error("Error downloading image:", error);
        // 可以在这里设置一个错误状态来通知用户下载失败
      });
  };

  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setProcessedImageUrl(null)
    setError(null)
  }

  return (
    <Layout>
      <h1
        className="text-6xl font-chango text-center tracking-tight leading-none mb-8"
        style={{
          textShadow: "4px 4px 0px #FFD700",
          letterSpacing: "1px",
          color: "#000",
        }}
      >
        REMOVE BACKGROUND
      </h1>

      {!imageFile ? (
        <ImageUploader onImageUpload={handleImageUpload} customImageSrc="/rmbg.png" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-pink-200 dark:bg-pink-300 overflow-hidden">
              <div className="bg-black text-white text-center py-2 font-black text-xl">ORIGINAL IMAGE</div>
              <div className="p-4 flex items-center justify-center" style={{ height: "400px", overflow: "hidden" }}>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] bg-red-300 text-black">
                {error}
              </div>
            )}

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
              <div className="bg-black text-white text-center py-2 font-black text-xl">RESULT WITH BACKGROUND REMOVED</div>
              <div className="p-4 flex items-center justify-center" style={{ height: "400px", overflow: "hidden" }}>
                {isProcessing ? (
                  <div className="text-center">
                    <div className="inline-block border-4 border-black p-3 bg-yellow-300 shadow-[5px_5px_0px_0px_rgba(0,0,0)] animate-pulse">
                      <p className="text-black font-black text-xl">PROCESSING...</p>
                    </div>
                  </div>
                ) : processedImageUrl ? (
                  <img
                    src={processedImageUrl}
                    alt="Background Removed"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                     <p className="text-black font-bold">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
             {processedImageUrl && (
                <div className="mt-4">
                  <div
                    className="w-full border-4 border-black p-3 bg-cyan-300 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex justify-center items-center"
                    onClick={handleDownload}
                  >
                    <div className="flex items-center">
                      <Download className="mr-3 h-6 w-6 stroke-[3]" />
                      <p className="text-black font-black text-xl">DOWNLOAD IMAGE</p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </Layout>
  );
}