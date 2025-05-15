import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ImageCompareResultProps {
  originalImage: string;
  processedImage: string;
  fileName?: string;
  onReset: () => void;
}

export function ImageCompareResult({
  originalImage,
  processedImage,
  fileName,
  onReset,
}: ImageCompareResultProps) {
  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = `bg-removed-${fileName || "image"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="rounded-xl border-2 border-gray-300 p-4 shadow-md">
  <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
    <div className="grid grid-cols-2 gap-2 h-full w-full">
      <div className="relative h-full w-full">
        <img
          src={originalImage}
          alt="处理前图片"
          className="rounded-lg"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            backgroundColor: "#EEEEEE",
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          原始图片
        </div>
      </div>
      <div className="relative h-full w-full">
        <img
          src={processedImage}
          alt="处理后图片"
          className="rounded-lg"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            backgroundColor: "#EEEEEE",
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          处理后图片
        </div>
      </div>
    </div>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <Button onClick={onReset} className="px-8">
          选择其他图片
        </Button>
        <Button
          onClick={handleDownload}
          className="border-4 border-black p-3 bg-green-300 shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex justify-center items-center px-8"
        >
          <Download className="mr-3 h-6 w-6 stroke-[3]" />
          下载结果
        </Button>
      </div>
    </div>
  );
}
