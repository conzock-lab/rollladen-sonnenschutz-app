import { useEffect, useState } from "react";

export function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function useLocalStorage(key, initialValue, options = {}) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === "function" ? initialValue() : initialValue;
    const stored = loadJson(key, fallback);
    return options.normalize ? options.normalize(stored) : stored;
  });

  useEffect(() => saveJson(key, value), [key, value]);

  return [value, setValue];
}
