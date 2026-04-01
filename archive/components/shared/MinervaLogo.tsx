export function MinervaLogo({ className = "h-5 w-5" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/minerva-logo-white.svg" alt="Minerva" className={`mn-minerva-logo ${className}`} />
}
