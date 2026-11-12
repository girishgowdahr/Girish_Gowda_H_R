import '@testing-library/jest-dom/vitest';

// Graceful fallback for jsdom where canvas is not implemented
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => null;
}

