export function MinervaLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <line x1="32" y1="0" x2="32" y2="64" />
      <line x1="0" y1="32" x2="64" y2="32" />
      <path d="M0 0 C20 8, 28 20, 32 32" />
      <path d="M64 0 C44 8, 36 20, 32 32" />
      <path d="M0 64 C20 56, 28 44, 32 32" />
      <path d="M64 64 C44 56, 36 44, 32 32" />
    </svg>
  )
}
