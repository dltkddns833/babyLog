"use client";

import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Heart {
  id: number;
  x: number;
  size: number;
  emoji: string;
  drift: number;
  duration: number;
  delay: number;
}

const EMOJIS = ["💖", "💗", "💕", "💓", "🩷", "🤍", "✨", "💜"];

let nextId = 0;

function HeartsOverlay({ hearts }: { hearts: Heart[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || hearts.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-heart-rise"
          style={{
            left: `${h.x}%`,
            bottom: `-5%`,
            fontSize: `${h.size}px`,
            "--drift": `${h.drift}px`,
            "--duration": `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          } as React.CSSProperties}
        >
          {h.emoji}
        </span>
      ))}
    </div>,
    document.body
  );
}

export default function HeartEasterEgg({ children }: { children: React.ReactNode }) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const burst = useCallback(() => {
    const count = 20 + Math.floor(Math.random() * 10);
    const newHearts: Heart[] = [];

    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: nextId++,
        x: Math.random() * 100,
        size: 18 + Math.random() * 30,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        drift: -40 + Math.random() * 80,
        duration: 2 + Math.random() * 1.5,
        delay: Math.random() * 0.6,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 4500);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={burst}
        className="cursor-pointer focus:outline-none active:scale-90 transition-transform"
        aria-label="이스터에그"
      >
        {children}
      </button>
      <HeartsOverlay hearts={hearts} />
    </>
  );
}
