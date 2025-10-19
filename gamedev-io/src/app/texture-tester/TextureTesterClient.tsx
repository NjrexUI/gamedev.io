'use client';

import { useSearchParams } from 'next/navigation';

export default function TextureTesterClient() {
  const params = useSearchParams();
  const textureUrl = params.get('textureUrl');

  return (
    <div className="w-full h-screen bg-neutral-900 flex flex-col items-center p-4">
      <h1 className="text-white text-2xl font-bold mb-4">3D Texture Tester</h1>
      {textureUrl ? (
        <iframe
          src={`/texture-tester-back/index.html?textureUrl=${encodeURIComponent(textureUrl)}`}
          className="w-full h-[80vh] border-0 rounded-lg"
        />
      ) : (
        <div className="text-white">No texture URL provided.</div>
      )}
    </div>
  );
}
