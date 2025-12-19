// Утилиты для работы с цветами

/**
 * Конвертирует HEX в RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Конвертирует RGB в HEX
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Конвертирует RGB в HSL
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Конвертирует HSL в RGB
 */
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Генерирует случайный цвет
 */
export function generateRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

/**
 * Генерирует гармоничную палитру с улучшенной контрастностью
 */
export function generateHarmoniousPalette(count = 5, baseColor = null) {
  const colors = [];
  
  if (baseColor) {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return generateHarmoniousPalette(count);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Равномерно распределяем яркость для лучшей контрастности
    const lightnessRange = [25, 75]; // Широкий диапазон для контрастности
    const step = (lightnessRange[1] - lightnessRange[0]) / (count - 1 || 1);
    
    for (let i = 0; i < count; i++) {
      const h = (hsl.h + i * 30) % 360;
      const s = Math.max(50, Math.min(90, hsl.s + (Math.random() - 0.5) * 20));
      // Равномерно распределяем яркость
      const l = lightnessRange[0] + (step * i) + (Math.random() - 0.5) * 10;
      const clampedL = Math.max(20, Math.min(85, l));
      const newRgb = hslToRgb(h, s, clampedL);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
  } else {
    const baseHue = Math.floor(Math.random() * 360);
    // Равномерно распределяем яркость для лучшей контрастности
    const lightnessRange = [25, 75];
    const step = (lightnessRange[1] - lightnessRange[0]) / (count - 1 || 1);
    
    for (let i = 0; i < count; i++) {
      const h = (baseHue + i * 72) % 360;
      const s = 50 + Math.random() * 40; // Увеличиваем минимальную насыщенность
      const l = lightnessRange[0] + (step * i) + (Math.random() - 0.5) * 10;
      const clampedL = Math.max(20, Math.min(85, l));
      const rgb = hslToRgb(h, s, clampedL);
      colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
  }
  
  return colors;
}

/**
 * Генерирует аналогичную палитру с улучшенной контрастностью
 */
export function generateAnalogousPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return generateHarmoniousPalette(count);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // Равномерно распределяем яркость для лучшей контрастности
  const lightnessRange = [25, 75];
  const step = (lightnessRange[1] - lightnessRange[0]) / (count - 1 || 1);
  
  for (let i = 0; i < count; i++) {
    const h = (hsl.h + (i - Math.floor(count / 2)) * 30) % 360;
    const s = Math.max(50, Math.min(90, hsl.s + (Math.random() - 0.5) * 15));
    // Равномерно распределяем яркость
    const l = lightnessRange[0] + (step * i) + (Math.random() - 0.5) * 10;
    const clampedL = Math.max(20, Math.min(85, l));
    const newRgb = hslToRgb(h, s, clampedL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерирует монохромную палитру с улучшенной контрастностью
 */
export function generateMonochromePalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return generateHarmoniousPalette(count);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // Используем более широкий диапазон яркости для лучшей контрастности
  const lightnessRange = [20, 80];
  const step = (lightnessRange[1] - lightnessRange[0]) / (count - 1 || 1);
  
  for (let i = 0; i < count; i++) {
    // Равномерно распределяем яркость по всему диапазону
    const l = lightnessRange[0] + (step * i);
    // Увеличиваем насыщенность для более ярких цветов
    const s = Math.max(40, Math.min(90, hsl.s + (l > 50 ? 10 : -5)));
    const newRgb = hslToRgb(hsl.h, s, l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерирует триаду палитру с улучшенной контрастностью
 */
export function generateTriadPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return generateHarmoniousPalette(count);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [baseColor];
  
  const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
  
  // Равномерно распределяем яркость для лучшей контрастности
  const lightnessRange = [25, 75];
  const remainingCount = count - 1;
  const step = remainingCount > 0 ? (lightnessRange[1] - lightnessRange[0]) / remainingCount : 0;
  
  for (let i = 1; i < count; i++) {
    const hueIndex = i % 3;
    const h = hues[hueIndex];
    const s = Math.max(50, Math.min(90, hsl.s + (Math.random() - 0.5) * 20));
    // Равномерно распределяем яркость
    const l = lightnessRange[0] + (step * (i - 1)) + (Math.random() - 0.5) * 10;
    const clampedL = Math.max(20, Math.min(85, l));
    const newRgb = hslToRgb(h, s, clampedL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерирует комплементарную палитру с улучшенной контрастностью
 */
export function generateComplementaryPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return generateHarmoniousPalette(count);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [baseColor];
  
  const complementaryHue = (hsl.h + 180) % 360;
  
  // Равномерно распределяем яркость для лучшей контрастности
  const lightnessRange = [25, 75];
  const remainingCount = count - 1;
  const step = remainingCount > 0 ? (lightnessRange[1] - lightnessRange[0]) / remainingCount : 0;
  
  for (let i = 1; i < count; i++) {
    const useComplementary = i % 2 === 0;
    const h = useComplementary ? complementaryHue : hsl.h;
    const s = Math.max(50, Math.min(90, hsl.s + (Math.random() - 0.5) * 20));
    // Равномерно распределяем яркость
    const l = lightnessRange[0] + (step * (i - 1)) + (Math.random() - 0.5) * 10;
    const clampedL = Math.max(20, Math.min(85, l));
    const newRgb = hslToRgb(h, s, clampedL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерирует палитру по настроению с улучшенной контрастностью
 */
export function generateMoodPalette(mood, count = 5) {
  const moods = {
    calm: { h: 200, s: 30, l: 50 },
    energetic: { h: 10, s: 80, l: 50 },
    professional: { h: 220, s: 40, l: 40 },
    warm: { h: 30, s: 60, l: 55 },
    cool: { h: 200, s: 50, l: 50 },
  };
  
  const base = moods[mood] || moods.calm;
  const colors = [];
  
  // Равномерно распределяем яркость для лучшей контрастности
  const lightnessRange = [25, 75];
  const step = (lightnessRange[1] - lightnessRange[0]) / (count - 1 || 1);
  
  for (let i = 0; i < count; i++) {
    const h = (base.h + i * 20) % 360;
    const s = Math.max(30, Math.min(85, base.s + (Math.random() - 0.5) * 20));
    // Равномерно распределяем яркость, но учитываем базовое настроение
    const baseL = lightnessRange[0] + (step * i);
    const l = Math.max(20, Math.min(85, baseL + (Math.random() - 0.5) * 10));
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

/**
 * Вычисляет относительную яркость цвета
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Вычисляет контрастность между двумя цветами
 */
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Проверяет соответствие стандарту WCAG
 */
export function checkWCAG(color1, color2) {
  const ratio = getContrastRatio(color1, color2);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: ratio >= 4.5,
    AALarge: ratio >= 3,
    AAA: ratio >= 7,
    AAALarge: ratio >= 4.5,
  };
}






