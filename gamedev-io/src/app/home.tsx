"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {

    const router = useRouter();

    const tools = [
      {
        title: "Text-To-Texture",
        description: "Generate ready to use textures for 3D models using text prompts",
        color: "bg-neutral-700 hover:bg-neutral-600",
        route: "/text-to-texture",
      },
      {
        title: "Sketch-To-Render",
        description: "Generate PNG renders using your own rough sketches",
        color: "bg-lime-500 hover:bg-lime-400",
        route: "/sketch-to-render",
      },
      {
        title: "Render-To-Model",
        description: "Generate complete 3D models for your in-game characters using renders",
        color: "bg-neutral-700 hover:bg-neutral-600",
        route: "/render-to-model",
      },
    ];

    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-5xl text-start mb-12">
          <h1 className="text-3xl font-bold mb-3">Game Development Tools</h1>
          <p className="text-neutral-400">
            Use powerful AI models to simplify your development process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {tools.map((tool) => (
            <motion.button
              key={tool.title}
              onClick={() => router.push(tool.route)}
              initial={{ y: 0 }}
              whileHover={{
                y: -8,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.45)",
                backgroundColor: "rgb(132, 204, 22)",
                color: "#000000",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{
                duration: 0.10,
                ease: "easeOut",
              }}
              className="rounded-2xl p-10 text-left bg-neutral-700 text-white transition-colors duration-150 h-96"
            >
              <h2 className="text-2xl font-semibold mb-3">{tool.title}</h2>
              <p className="text-neutral-300">{tool.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
