import { Suspense } from 'react';
import TextureTesterClient from './TextureTesterClient';

export default function TextureTesterPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <TextureTesterClient />
    </Suspense>
  );
}
