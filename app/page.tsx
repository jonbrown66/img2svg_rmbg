"use client"

import { ImageToSvgConverter } from "@/components/image-to-svg-converter"
import { useState } from "react"
import { Layout } from "@/components/layout"

export default function HomePage() {
  const [hasImage, setHasImage] = useState(false)

  const handleImageStateChange = (
    hasImage: boolean,
    canDownload: boolean,
    downloadFn: ((format?: string) => void) | null,
  ) => {
    setHasImage(hasImage)
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div className="w-10 h-10"></div> {/* Placeholder for spacing */}
        <h1
          className="text-6xl font-chango text-center flex-grow tracking-tight leading-none"
          style={{
            textShadow: "4px 4px 0px #FFD700",
            letterSpacing: "1px",
            color: "#000",
          }}
        >
          IMAGE TO SVG
        </h1>
        <div className="w-10 h-10"></div> {/* Placeholder for spacing */}
      </div>
      <ImageToSvgConverter onImageStateChange={handleImageStateChange} />
    </Layout>
  )
}
