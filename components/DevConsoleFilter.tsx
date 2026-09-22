"use client";

import { useEffect } from "react";

const NOISY_DEV_WARNINGS = [
  "THREE.Clock: This module has been deprecated",
  "THREE.WebGLProgram: Program Info Log",
];

export default function DevConsoleFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalWarn = console.warn;

    console.warn = (...args: unknown[]) => {
      const message = args.map(String).join(" ");
      if (NOISY_DEV_WARNINGS.some((warning) => message.includes(warning))) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
