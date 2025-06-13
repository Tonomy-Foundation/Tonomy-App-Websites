// File: utils/color.ts
// Based on WCAG contrast recommendations: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance

function hexToHSL(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;

  const g = parseInt(hex.substring(3, 5), 16) / 255;

  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;

  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;

  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));

  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  r = Math.round((r + m) * 255);

  g = Math.round((g + m) * 255);

  b = Math.round((b + m) * 255);

  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

export function hexToRGB(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);

  const g = parseInt(hex.substring(3, 5), 16);

  const b = parseInt(hex.substring(5, 7), 16);

  return `${r}, ${g}, ${b}`;
}

function hexToRGBObject(hex: string) {
  return {
    r: parseInt(hex.substring(1, 3), 16),

    g: parseInt(hex.substring(3, 5), 16),

    b: parseInt(hex.substring(5, 7), 16),
  };
}

export function adjustColor(hex: string, lightnessChange: number) {
  const hsl = hexToHSL(hex);

  if (hsl.l === 100 && lightnessChange > 0) {
    hsl.l = Math.max(95, hsl.l - lightnessChange);
  } else if (hsl.l === 0 && lightnessChange < 0) {
    hsl.l = Math.min(5, hsl.l - lightnessChange);
  } else {
    hsl.l = Math.min(100, Math.max(0, hsl.l + lightnessChange));
  }

  return hslToHex(hsl.h, hsl.s, hsl.l);
}

export function adjustBackgroundColor(hex: string) {
  const { r, g, b } = hexToRGBObject(hex);

  // WCAG relative luminance calculation
  const [R, G, B] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return luminance > 0.179 ? adjustColor(hex, 10) : "#141414";
}

// Exported: WCAG-based text color contrast function
export function getContrastTextColor(bgHex: string) {
  const { r, g, b } = hexToRGBObject(bgHex);

  // WCAG relative luminance calculation
  const [R, G, B] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}
