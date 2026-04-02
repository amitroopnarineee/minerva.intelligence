"use client";

export default function WorkspacePage() {
  return (
    <div className="h-full w-full">
      <iframe
        src="/workspace.html"
        className="w-full h-full border-0 block"
        title="Audience Scoring Workspace"
      />
    </div>
  );
}
