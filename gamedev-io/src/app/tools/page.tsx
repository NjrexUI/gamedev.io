'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // Add Suspense import
import { motion, AnimatePresence } from "framer-motion";
import TextToTextureTool from "./text-texture/page";
import SketchToRenderTool from "./sketch-to-render/page";

function ToolsContent() {
  const title = "Game Developer's Tools";
  let baseUrl = "https://gamedev-io.vercel.app";
  if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:3000";
  }

  const searchParams = useSearchParams();
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    const initialTool = searchParams.get("tool");
    if (initialTool) setActiveTool(initialTool);
  }, [searchParams]);

  const tools = [
    { id: "text-to-texture", label: "Text-To-Texture" },
    { id: "sketch-to-render", label: "Sketch-To-Render" },
    { id: "render-to-model", label: "Render-To-Model" },
  ];

  const renderContent = () => {
    switch (activeTool) {
      case "text-to-texture":
        return <TextToTextureTool />;
      case "sketch-to-render":
        return <SketchToRenderTool />;
      case "render-to-model":
        return <p>Render-to-Model tool content</p>;
      default:
        return <p>Select a tool from above</p>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center px-6 py-10">
      <div className="flex justify-between items-center w-full max-w-6xl mb-10">
        <h1 className="text-xl font-semibold">Game Development Tools</h1>
        {activeTool && (
          <button
            onClick={() => setActiveTool(null)}
            className="text-sm px-4 py-2 rounded-md bg-neutral-700 hover:bg-lime-500 hover:text-black transition-colors duration-200"
          >
            Home
          </button>
        )}
      </div>

      <div className="flex space-x-6 mb-8 bg-neutral-800 px-8 py-4 rounded-full">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-lime-500 text-black shadow-lg"
                  : "bg-neutral-700 text-white hover:bg-neutral-600"
              }`}
            >
              {tool.label}
            </motion.button>
          );
        })}
      </div>

      <div className="w-full max-w-5xl bg-neutral-800 mt-4 rounded-2xl p-10 shadow-lg min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool ?? "home"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">Loading...</div>}>
      <ToolsContent />
    </Suspense>
  );
}