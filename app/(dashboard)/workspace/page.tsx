"use client";

import { MinervaMenuBar } from "@/components/shared/MinervaMenuBar";
import { useEffect, useRef } from "react";

export default function WorkspacePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Hide the workspace's built-in topbar via injected CSS
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          const style = doc.createElement('style');
          style.textContent = '.mn-workspace-topbar { display: none !important; } .mn-workspace-shell { inset: 0 !important; gap: 0 !important; padding-top: 0 !important; }';
          doc.head.appendChild(style);
        }
      } catch (e) { /* cross-origin safety */ }
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <MinervaMenuBar />
      <iframe
        ref={iframeRef}
        src="/workspace.html"
        style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
        title="Audience Scoring Workspace"
      />
    </div>
  );
}
