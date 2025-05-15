import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Chango } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
})

const chango = Chango({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chango",
})

export const metadata: Metadata = {
  title: "Image to SVG Converter - Vectorizer AI",
  description: "Convert your images to scalable vector graphics (SVG) using Vectorizer AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.className} ${chango.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
