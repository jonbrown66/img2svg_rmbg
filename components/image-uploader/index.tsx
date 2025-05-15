"use client"

import type React from "react"
import Image from "next/image"
import { useState, useRef } from "react"
import type { Props } from "./types"

export function ImageUploader({ onImageUpload, customImageSrc }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onImageUpload(file, preview)
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0)] bg-green-300 text-center cursor-pointer h-[400px] flex flex-col items-center justify-center ${
        isDragging ? "bg-green-200" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />
      <Image src={customImageSrc || "/image-to-svg.png"} alt="Image upload" width={240} height={120} className="mb-4" unoptimized />
      <p className="mt-4 text-xl font-black text-black" style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.3)" }}>
        Drag and drop an image, or click to browse
      </p>
      <p className="mt-2 text-sm font-bold text-black">Supports JPG, PNG, WebP, GIF (max 5MB)</p>
    </div>
  )
}
