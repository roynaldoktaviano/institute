"use client";
import { useEffect } from "react";

export default function BlockInspect() {
  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // blok beberapa shortcut umum devtools / view source
      if (
        // F12
        e.key === "F12" ||
        // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        // Ctrl+U (view source)
        (e.ctrlKey && e.key.toUpperCase() === "U") ||
        // Ctrl+Shift+K (Firefox console)
        (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "K")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // disable right click
    document.addEventListener("contextmenu", onContext);
    // block keys
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null; // tidak render apa-apa, hanya side-effect
}
