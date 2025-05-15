import type { ApiMode } from "@/components/settings/types"

// Client-side interfaces
export interface VectorizerOptions {
  mode?: ApiMode
  maxColors?: number
  retentionDays?: number
  palette?: string
  minAreaPx?: number
  fileFormat?: "svg" | "eps" | "pdf" | "dxf" | "png"
}

export interface VectorizerResponse {
  svgData: string
  imageToken?: string
  creditsCharged?: number
  creditsCalculated?: number
  receipt?: string
}

// Client-side functions
export async function convertImageToSvg(imageFile: File, mode?: ApiMode): Promise<string> {
  const result = await vectorizeImage(imageFile, { mode })
  return result.svgData
}

export async function vectorizeImage(imageFile: File, options: VectorizerOptions = {}): Promise<VectorizerResponse> {
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error("Image size exceeds 5MB limit")
  }

  const supportedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!supportedTypes.includes(imageFile.type)) {
    throw new Error("Unsupported file type. Please use JPG, PNG, WebP, or GIF")
  }

  const formData = new FormData()
  formData.append("image", imageFile)

  // Add options to formData
  if (options.mode) {
    formData.append("mode", options.mode)
  }

  if (options.maxColors !== undefined) {
    formData.append("processing.max_colors", options.maxColors.toString())
  }

  if (options.retentionDays !== undefined) {
    formData.append("policy.retention_days", options.retentionDays.toString())
  }

  if (options.palette) {
    formData.append("processing.palette", options.palette)
  }

  if (options.minAreaPx !== undefined) {
    formData.append("processing.shapes.min_area_px", options.minAreaPx.toString())
  }

  if (options.fileFormat) {
    formData.append("output.file_format", options.fileFormat)
  }

  try {
    const response = await fetch("/api/vectorize", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const svgData = await response.text()
    const imageToken = response.headers.get("X-Image-Token") || undefined
    const creditsCharged = Number.parseFloat(response.headers.get("X-Credits-Charged") || "0")
    const creditsCalculated = Number.parseFloat(response.headers.get("X-Credits-Calculated") || "0")
    const receipt = response.headers.get("X-Receipt") || undefined

    return {
      svgData,
      imageToken,
      creditsCharged,
      creditsCalculated,
      receipt,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to convert image to SVG")
  }
}

export async function downloadVectorizedImage(
  imageToken: string,
  receipt?: string,
  fileFormat: "svg" | "eps" | "pdf" | "dxf" | "png" = "svg",
): Promise<VectorizerResponse> {
  const formData = new FormData()
  formData.append("image.token", imageToken)
  formData.append("output.file_format", fileFormat)

  if (receipt) {
    formData.append("receipt", receipt)
  }

  try {
    const response = await fetch("/api/vectorize/download", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const svgData = await response.text()
    const newReceipt = response.headers.get("X-Receipt") || undefined
    const creditsCharged = Number.parseFloat(response.headers.get("X-Credits-Charged") || "0")
    const creditsCalculated = Number.parseFloat(response.headers.get("X-Credits-Calculated") || "0")

    return {
      svgData,
      receipt: newReceipt,
      creditsCharged,
      creditsCalculated,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to download vectorized image")
  }
}

export async function getAccountStatus(): Promise<{
  subscriptionPlan: string
  subscriptionState: string
  credits: number
}> {
  try {
    const response = await fetch("/api/vectorize/account")

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to get account status")
  }
}

export async function deleteImage(imageToken: string): Promise<boolean> {
  const formData = new FormData()
  formData.append("image.token", imageToken)

  try {
    const response = await fetch("/api/vectorize/delete", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to delete image")
  }
}
