'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TextToRenderTool() {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("720p");
  const [style, setStyle] = useState("realistic");
  const [makeTile, setMakeTile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);

    if (!prompt.trim()) {
      setError("Prompt is required.");
      return;
    }

    setLoading(true);
    setImageUrl(null);

    const payload = {
      prompt,
      resolution,
      style,
      make_it_tile: Boolean(makeTile),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/generate-textures/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${txt}`);
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("No image URL returned from server.");
      }

      setImageUrl(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto mt-4">
      <div className="flex-1 bg-neutral-800 p-6 rounded-2xl shadow-lg flex flex-col">
        <div>
          <label className="block text-sm font-semibold mb-2">Enter your prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= 1000) setPrompt(e.target.value);
            }}
            className="w-full h-32 p-3 rounded-md bg-neutral-700 text-white resize-none outline-none"
            placeholder="Describe your texture..."
          />
          <div className="text-xs text-neutral-400 mt-1">
            Character count: {prompt.length} / 1000
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1">Texture resolution:</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full bg-neutral-700 p-2 rounded-md text-white"
            >
              <option value={"720p"}>720p</option>
              <option value={"1080p"}>1080p</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Texture style:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-neutral-700 p-2 rounded-md text-white"
            >
              <option value="realistic">Realistic</option>
              <option value="stylized">Stylized</option>
              <option value="cartoonish">Cartoonish</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="make-tile"
              type="checkbox"
              checked={makeTile}
              onChange={(e) => setMakeTile(e.target.checked)}
              className="w-4 h-4 accent-lime-500"
            />
            <label htmlFor="make-tile" className="text-sm font-semibold">
              Make-it-tile
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-4 py-2 rounded-md"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={() => {
              setPrompt("");
              setImageUrl(null);
              setError(null);
            }}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>

          {error && <div className="text-sm text-red-400 ml-4">{error}</div>}
        </div>
      </div>

      <div className="flex-1 bg-neutral-800 rounded-2xl shadow-lg flex flex-col justify-center items-center relative aspect-square min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-neutral-400">Generating texture…</div>
          </div>
        )}

        {!loading && !imageUrl && (
          <div className="text-neutral-400">
            No texture yet. Click Generate to create one.
          </div>
        )}

        {!loading && imageUrl && (
          <AnimatePresence mode="wait">
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt="Generated texture"
              className="w-[85%] h-[85%] object-cover rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        )}

          {/* Only show Test button if imageUrl exists */}
          {imageUrl && (
          <button
            onClick={async () => {
              try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                const fileName = imageUrl.split('/').pop() || 'texture.jpg';
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                router.push(`/texture-tester?textureUrl=${encodeURIComponent(imageUrl)}`);
              } catch (error) {
                console.error('Error downloading image:', error);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Test on 3D Model
          </button>
        )}
      </div>
    </div>
  );
}
