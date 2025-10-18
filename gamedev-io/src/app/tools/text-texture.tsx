"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TextToTextureTool() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("512px");
  const [style, setStyle] = useState("realistic");
  const [makeTile, setMakeTile] = useState(false);
  const [textureCount, setTextureCount] = useState("1");
  const [currentTexture, setCurrentTexture] = useState(0);

  // Placeholder generated textures
  const textures = Array.from({ length: Number(textureCount) }, (_, i) => ({
    id: i,
    url: "https://placehold.co/512x512/808080/FFFFFF?text=Texture+" + (i + 1),
  }));

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 1000) {
      setPrompt(e.target.value);
    }
  };

  const nextTexture = () => {
    setCurrentTexture((prev) => (prev + 1) % textures.length);
  };

  const prevTexture = () => {
    setCurrentTexture(
      (prev) => (prev - 1 + textures.length) % textures.length
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto mt-4">
      {/* LEFT PANEL */}
      <div className="flex-1 bg-neutral-800 p-6 flex-col justify-between">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Enter your prompt:
          </label>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            className="w-full h-32 p-3 rounded-md bg-neutral-700 text-white resize-none outline-none"
            placeholder="Describe your texture..."
          />
          <div className="text-xs text-neutral-400 mt-1">
            Character count: {prompt.length} / 1000
          </div>
        </div>

        {/* Texture Resolution */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">
            Texture resolution:
          </label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full bg-neutral-700 p-2 rounded-md text-white"
          >
            <option>512px</option>
            <option>1024px</option>
            <option>2048px</option>
          </select>
        </div>

        {/* Texture Style */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">
            Texture style:
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-neutral-700 p-2 rounded-md text-white"
          >
            <option>Realistic</option>
            <option>Stylized</option>
            <option>Cartoonish</option>
          </select>
        </div>

        {/* Make it Tile */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={makeTile}
            onChange={(e) => setMakeTile(e.target.checked)}
            id="make-tile"
            className="w-4 h-4 accent-lime-500"
          />
          <label htmlFor="make-tile" className="text-sm font-semibold">
            Make-it-tile
          </label>
        </div>

        {/* Texture Count */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">
            Texture count:
          </label>
          <select
            value={textureCount}
            onChange={(e) => {
              setTextureCount(e.target.value);
              setCurrentTexture(0);
            }}
            className="w-full bg-neutral-700 p-2 rounded-md text-white"
          >
            <option>1</option>
            <option>2</option>
            <option>4</option>
          </select>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-neutral-800 flex flex-col justify-center items-center relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTexture}
            src={textures[currentTexture].url}
            alt={`Texture ${currentTexture + 1}`}
            className="w-[90%] h-auto rounded-md object-contain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        {textures.length > 1 && (
          <div className="absolute bottom-4 flex space-x-4">
            <button
              onClick={prevTexture}
              className="bg-neutral-700 hover:bg-lime-500 hover:text-black px-4 py-2 rounded-lg text-sm transition-colors duration-150"
            >
              Prev
            </button>
            <button
              onClick={nextTexture}
              className="bg-neutral-700 hover:bg-lime-500 hover:text-black px-4 py-2 rounded-lg text-sm transition-colors duration-150"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
