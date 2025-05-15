export interface Props {
  className?: string
  onImageStateChange?: (hasImage: boolean, canDownload: boolean, downloadFn: ((format?: string) => void) | null) => void
}
