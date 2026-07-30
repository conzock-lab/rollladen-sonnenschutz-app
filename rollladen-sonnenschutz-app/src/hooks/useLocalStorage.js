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

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => loadJson(key, initialValue));

  useEffect(() => saveJson(key, value), [key, value]);

  return [value, setValue];
}
