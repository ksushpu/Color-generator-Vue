import { ref, computed, watch } from 'vue';
import { saveCurrentPalette as saveCurrentPaletteUtil, getCurrentPalette } from '../utils/storageUtils';

// Глобальное состояние палитры
const palette = ref([]);

// Инициализация из localStorage
const saved = getCurrentPalette();
if (saved && saved.length > 0) {
  palette.value = saved;
}

// Автосохранение при изменении
watch(palette, (newVal) => {
  saveCurrentPaletteUtil(newVal);
}, { deep: true });

export function usePalette() {
  return {
    palette,
    setPalette: (newPalette) => {
      palette.value = newPalette;
    },
    getPalette: () => palette.value,
  };
}

