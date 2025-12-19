// Утилиты для работы с localStorage

export function savePalette(palette) {
  const palettes = getSavedPalettes();
  palettes.push({
    ...palette,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('colorPalettes', JSON.stringify(palettes));
  return palettes[palettes.length - 1];
}

export function getSavedPalettes() {
  const stored = localStorage.getItem('colorPalettes');
  return stored ? JSON.parse(stored) : [];
}

export function deletePalette(id) {
  const palettes = getSavedPalettes();
  const filtered = palettes.filter((p) => p.id !== id);
  localStorage.setItem('colorPalettes', JSON.stringify(filtered));
  return filtered;
}

export function updatePalette(id, updates) {
  const palettes = getSavedPalettes();
  const index = palettes.findIndex((p) => p.id === id);
  if (index !== -1) {
    palettes[index] = { ...palettes[index], ...updates };
    localStorage.setItem('colorPalettes', JSON.stringify(palettes));
    return palettes[index];
  }
  return null;
}

export function saveCurrentPalette(colors) {
  localStorage.setItem('currentPalette', JSON.stringify(colors));
}

export function getCurrentPalette() {
  const stored = localStorage.getItem('currentPalette');
  return stored ? JSON.parse(stored) : null;
}






