import { removeBackground } from "@imgly/background-removal";

// 将文件转换为 Data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to data URL"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

// 处理背景移除并返回处理后的URL
export const processImageBackground = async (file: File): Promise<string> => {
  // 配置背景移除选项
  const config = {
    debug: true,
    progress: (key: string, current: number, total: number) => {
      // 显示进度
      const percentage = Math.round((current / total) * 100);
      console.log(`处理进度: ${key} ${percentage}%`);
    },
  };

  // 调用背景移除库
  const processedBlob = await removeBackground(file, config);

  // 创建结果URL
  return URL.createObjectURL(processedBlob);
};
