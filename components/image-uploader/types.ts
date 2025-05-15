export interface Props {
  onImageUpload: (file: File, preview: string) => void;
  customImageSrc?: string;
}
