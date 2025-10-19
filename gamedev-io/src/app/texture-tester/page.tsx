import { Suspense } from 'react';
import TextureTesterClient from './TextureTesterClient';

export const dynamic = 'force-dynamic';

export default function TextureTesterPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <TextureTesterClient />
    </Suspense>
  );
}
