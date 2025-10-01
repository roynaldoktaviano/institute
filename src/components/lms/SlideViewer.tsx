"use client";
import { useEffect, useState } from "react";

export default function SlideViewer({ fileUrl }: { fileUrl: string }) {
  const [slides, setSlides] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/slides?fileUrl=${encodeURIComponent(fileUrl)}`)
      .then(res => res.json())
      .then(data => setSlides(data.slides || []));
  }, [fileUrl]);

  if (!slides.length) return <div>Loading slides...</div>;

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", maxWidth: 1000, margin: "0 auto" }}
    >
      <img
        src={slides[index]}
        alt={`Slide ${index + 1}`}
        style={{ width: "100%", pointerEvents: "none" }}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={() => setIndex(i => Math.max(i - 1, 0))} disabled={index === 0}>
          Prev
        </button>
        <span>{index + 1} / {slides.length}</span>
        <button onClick={() => setIndex(i => Math.min(i + 1, slides.length - 1))} disabled={index === slides.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
