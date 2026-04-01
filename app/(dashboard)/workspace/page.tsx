"use client";
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100 }}>
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 200,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)',
          borderRadius: 6,
          padding: '4px 10px',
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: '-apple-system, sans-serif',
        }}
      >
        ← Back
      </button>
      <iframe
        src="/workspace.html"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="Audience Scoring Workspace"
      />
    </div>
  );
}
