"use client"

import { useEffect, useRef } from "react"
import type { Props } from "./types"

export function SvgPreview({ svgData, originalWidth, originalHeight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && svgData) {
      containerRef.current.innerHTML = svgData

      const svgElement = containerRef.current.querySelector("svg")
      if (svgElement) {
        svgElement.setAttribute("width", "100%")
        svgElement.setAttribute("height", "100%")
        svgElement.style.maxWidth = "100%"
        svgElement.style.maxHeight = "100%"

        if (originalWidth && originalHeight) {
          svgElement.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`)
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet")
        }
      }
    }
  }, [svgData, originalWidth, originalHeight])

  return <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
}
