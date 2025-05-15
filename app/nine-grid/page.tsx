import { NineGridGenerator } from "@/components/nine-grid-generator";
import { Layout } from "@/components/layout";

export default function NineGridPage() {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-6xl font-chango text-center tracking-tight leading-none mb-8"
        style={{
          textShadow: "4px 4px 0px #FFD700",
          letterSpacing: "1px",
          color: "#000",}}>Nine-Grid</h1>
        <NineGridGenerator />
      </div>
    </Layout>
  );
}