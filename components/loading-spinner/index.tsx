import type { Props } from "./types"

export function LoadingSpinner({ size = 40, color = "#000000" }: Props) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute border-4 border-black rounded-full animate-spin"
        style={{
          width: size,
          height: size,
          borderTopColor: color,
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
          boxShadow: "3px 3px 0 rgba(0,0,0,0.8)",
        }}
      />
      <div
        className="absolute border-4 border-black rounded-full animate-ping opacity-30"
        style={{
          width: size,
          height: size,
          animationDuration: "1.5s",
        }}
      />
    </div>
  )
}
