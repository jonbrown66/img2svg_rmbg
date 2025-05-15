"use client"

import { useState, useEffect } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { SvgPreview } from "@/components/svg-preview"
import { Download, RefreshCw } from "lucide-react"
import type { Props } from "./types"
import ImageTracer from "imagetracerjs"

// Add a global reset function that can be called from outside
declare global {
  interface Window {
    imageToSvgReset?: () => void
  }
}

export function ImageToSvgConverter({ className, onImageStateChange }: Props) {
  const [isConverting, setIsConverting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [svgData, setSvgData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)

  // Register the reset function globally so it can be called from the parent
  useEffect(() => {
    window.imageToSvgReset = handleReset
    return () => {
      delete window.imageToSvgReset
    }
  }, [])

  // Notify parent component when image state changes
  useEffect(() => {
    if (onImageStateChange) {
      onImageStateChange(!!imageFile, !!svgData, svgData ? handleDownload : null)
    }
  }, [imageFile, svgData, onImageStateChange])

  const handleImageUpload = (file: File, preview: string) => {
    setImageFile(file)
    setImagePreview(preview)
    setSvgData(null)
    setError(null)

    const img = new Image()
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      })
    }
    img.src = preview

    // Automatically start conversion when image is uploaded
    convertImage(file)
  }

  const convertImage = async (file: File) => {
    try {
      setIsConverting(true)
      setError(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            setError("Failed to get canvas context")
            setIsConverting(false)
            return
          }
          ctx.drawImage(img, 0, 0)
          const imageData = ctx.getImageData(0, 0, img.width, img.height)

          // Use ImageTracer.js to convert ImageData to SVG
          // Using default options for now
          const svgstr = ImageTracer.imagedataToSVG(imageData, {})
          setSvgData(svgstr)
          setIsConverting(false)
        }
        img.onerror = () => {
          setError("Failed to load image for conversion")
          setIsConverting(false)
        }
        img.src = event.target?.result as string
      }
      reader.onerror = () => {
        setError("Failed to read image file")
        setIsConverting(false)
      }
      reader.readAsDataURL(file)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert image to SVG")
      setIsConverting(false)
    }
  }

  const handleDownload = () => {
    if (!svgData || !imageFile) return

    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${imageFile.name.split(".")[0] || "image"}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setSvgData(null)
    setError(null)
    setImageDimensions(null)
  }

  if (!imageFile) {
    return (
      <div className={`w-full max-w-5xl mx-auto ${className}`}>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    )
  }

  const imageContainerStyle = {
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
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
            <div className="bg-black text-white text-center py-2 font-black text-xl">SVG RESULT</div>
            <div style={imageContainerStyle} className="p-4">
              {svgData ? (
                <SvgPreview
                  svgData={svgData}
                  originalWidth={imageDimensions?.width}
                  originalHeight={imageDimensions?.height}
                />
              ) : (
                <div className="flex items-center justify-center">
                  {isConverting ? (
                    <div className="text-center">
                      <div className="inline-block border-4 border-black p-3 bg-yellow-300 shadow-[5px_5px_0px_0px_rgba(0,0,0)] animate-pulse">
                        <p className="text-black font-black text-xl">CONVERTING...</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-black font-bold">SVG will appear here after conversion</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {svgData && (
            <div className="mt-4">
              <div
                className="w-full border-4 border-black p-3 bg-cyan-300 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex justify-center items-center"
                onClick={handleDownload}
              >
                <div className="flex items-center">
                  <Download className="mr-3 h-6 w-6 stroke-[3]" />
                  <p className="text-black font-black text-xl">DOWNLOAD SVG</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
