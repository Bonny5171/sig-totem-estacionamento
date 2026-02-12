"use client";
import { useEffect, useRef } from "react";

export function useBarcodeScanner(onScan: (code: string) => void) {
  const buffer = useRef("");
  const lastTime = useRef(0);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const now = Date.now();

      if (now - lastTime.current > 100) {
        buffer.current = "";
      }

      lastTime.current = now;

      if (e.key === "Enter") {
        if (buffer.current.length > 3) {
          const code = buffer.current;

          onScanRef.current(code);

          buffer.current = "";
        }
        return;
      }

      if (e.key.length === 1) {
        buffer.current += e.key;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
