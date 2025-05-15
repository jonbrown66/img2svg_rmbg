# Image to SVG Converter

这是一个使用 Next.js 构建的图片转换小工具，能够实现1.img转svg;2.图片背景移除;3.图片转九宫格。
![image](https://github.com/user-attachments/assets/ed9061b6-326b-44bb-9ebc-0ce966f7567f)

[1]:https://img2svg-rmbg.vercel.app/

## 功能

- 将上传的图片转换为 SVG（ImageTracer.js）
- 图片背景移除（@imgly/background-removal）
- 九宫格生成器：将图片分割为九宫格样式（fabric.js）


## 技术栈

- **框架**: Next.js
- **UI 库**: React
- **语言**: TypeScript
- **样式**: Tailwind CSS, Shadcn UI

## 安装和使用

1.  克隆仓库：
    ```bash
    git clone https://github.com/jonbrown66/img2svg_rmbg.git
    cd img2svg-rmbg
    ```
2.  安装依赖 (使用 pnpm):
    ```bash
    pnpm install
    ```
3.  运行开发服务器：
    ```bash
    pnpm dev
    ```
    应用将在 `http://localhost:3000` 启动。
