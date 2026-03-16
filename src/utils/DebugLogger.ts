const debugEnabled = process.env.K11_DEBUG === 'true';

export function debugLog(...args: unknown[]) {
  if (debugEnabled) {
    console.log(...args);
  }
}

export function debugWarn(...args: unknown[]) {
  if (debugEnabled) {
    console.warn(...args);
  }
}
