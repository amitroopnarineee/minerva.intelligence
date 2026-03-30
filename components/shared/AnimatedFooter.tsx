"use client"
import React, { useEffect, useRef, useState } from "react";

interface LinkItem {
  href: string;
  label: string;
}

interface FooterProps {
  leftLinks: LinkItem[];
  rightLinks: LinkItem[];
  copyrightText: string;
  barCount?: number;
}

const AnimatedFooter: React.FC<FooterProps> = ({
  leftLinks,
  rightLinks,
  copyrightText,
  barCount = 23,
}) => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry) setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => { if (footerRef.current) observer.unobserve(footerRef.current); };
  }, []);

  useEffect(() => {
    let t = 0;
    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;
      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });
      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };
    if (isVisible) animateWave();
    else if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; }
    return () => { if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; } };
  }, [isVisible]);

  return (
    <footer ref={footerRef} className="bg-background text-foreground relative flex flex-col w-full justify-between select-none border-t">
      <div className="mx-auto flex flex-col md:flex-row justify-between w-full gap-4 pb-24 pt-8 px-6 max-w-6xl">
        <div className="space-y-2">
          <ul className="flex flex-wrap gap-4">
            {leftLinks.map((link, index) => (
              <li key={index}><a href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</a></li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4">{copyrightText}</p>
        </div>
        <div className="space-y-4">
          <ul className="flex flex-wrap gap-4">
            {rightLinks.map((link, index) => (
              <li key={index}><a href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" style={{ overflow: "hidden", height: 200 }}>
        <div>
          {Array.from({ length: barCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { waveRefs.current[index] = el; }}
              style={{
                height: `${index + 1}px`,
                backgroundColor: "currentColor",
                opacity: 0.15 + (index / barCount) * 0.85,
                transition: "transform 0.1s ease",
                willChange: "transform",
                marginTop: "-2px",
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default AnimatedFooter;
