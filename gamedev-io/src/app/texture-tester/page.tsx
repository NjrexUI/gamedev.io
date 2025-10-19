import { Suspense } from 'react';
import TextureTesterClient from './TextureTesterClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function TextureTesterPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <TextureTesterClient />
    </Suspense>
  );
}
