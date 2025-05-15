import Image from "next/image"
import type { Props } from "./types"

export function Footer({ className }: Props) {
  return (
    <footer className={`py-4 w-full bg-black text-white ${className}`}>
      <div className="flex items-center justify-center text-sm">
        <a
          href="https://vectorizer.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-300 transition-colors"
        >
          <span>Powered by</span>
          <Image src="/vectorizer-logo.svg" alt="Vectorizer.AI" width={20} height={20} className="mx-2" />
          <span className="font-bold">Vectorizer.AI</span>
        </a>
      </div>
    </footer>
  )
}
