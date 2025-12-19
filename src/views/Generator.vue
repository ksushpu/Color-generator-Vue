<template>
  <div class="generator">
    <div class="generator-header">
      <h1>Генератор палитр</h1>
      <p>Создавайте гармоничные цветовые схемы</p>
    </div>

    <!-- Базовые настройки -->
    <div class="settings-panel">
      <div class="setting-group">
        <label>Количество цветов:</label>
        <div class="radio-group">
          <label v-for="count in [3, 5, 7]" :key="count" class="radio-label">
            <input
              type="radio"
              :value="count"
              v-model="colorCount"
              @change="generatePalette"
            />
            <span>{{ count }}</span>
          </label>
        </div>
      </div>

      <div class="setting-group">
        <label>Формат отображения:</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="hex" v-model="displayFormat" />
            <span>HEX</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="rgb" v-model="displayFormat" />
            <span>RGB</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Продвинутые настройки -->
    <div class="advanced-settings">
      <h3>Продвинутая генерация</h3>
      
      <div class="setting-group">
        <label>Базовый цвет:</label>
        <div class="color-picker-wrapper">
          <input
            type="color"
            v-model="baseColor"
            class="color-picker"
            @change="generatePalette"
          />
          <input
            type="text"
            v-model="baseColor"
            class="color-input"
            placeholder="#FF6B6B"
            @change="generatePalette"
          />
        </div>
        <div class="color-wheel-section">
          <button
            @click="showColorWheel = !showColorWheel"
            class="toggle-wheel-btn"
          >
            {{ showColorWheel ? '🔽' : '🔼' }} Цветовой круг
          </button>
          <div v-if="showColorWheel" class="color-wheel-wrapper">
            <ColorWheel
              v-model="baseColor"
              :size="200"
              @change="generatePalette"
            />
          </div>
        </div>
      </div>

      <div class="setting-group">
        <label>Тип палитры:</label>
        <select v-model="paletteType" @change="generatePalette" class="select-input">
          <option value="harmonious">Гармоничная</option>
          <option value="analogous">Аналогичная</option>
          <option value="monochrome">Монохромная</option>
          <option value="triad">Триада</option>
          <option value="complementary">Комплементарная</option>
        </select>
      </div>

      <div class="setting-group">
        <label>Настроение:</label>
        <div class="mood-buttons">
          <button
            v-for="mood in moods"
            :key="mood.value"
            @click="generateMoodPaletteHandler(mood.value)"
            class="mood-btn"
            :class="{ active: selectedMood === mood.value }"
          >
            {{ mood.emoji }} {{ mood.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Кнопка генерации -->
    <div class="actions">
      <button @click="generatePalette" class="btn-generate">
        🎨 Сгенерировать палитру
      </button>
      <button @click="clearLocks" class="btn-clear" v-if="hasLockedColors">
        🔓 Разблокировать все
      </button>
    </div>

    <!-- Отображение палитры -->
    <div class="palette-container">
      <div class="palette-grid">
        <ColorCard
          v-for="(color, index) in palette"
          :key="index"
          :color="color"
          :format="displayFormat"
          :is-locked="lockedIndices.includes(index)"
          @lock="() => lockColor(index)"
          @unlock="() => unlockColor(index)"
          @copy="handleColorCopy"
        />
      </div>
    </div>

    <!-- Превью палитры -->
    <div class="preview-section">
      <h3>Превью палитры</h3>
      <PalettePreview :colors="palette" />
    </div>

    <!-- Анализ доступности -->
    <div class="accessibility-section" v-if="palette.length >= 2">
      <h3>Анализ доступности</h3>
      <div class="contrast-grid">
        <div
          v-for="(pair, idx) in contrastPairs"
          :key="idx"
          class="contrast-item"
        >
          <div class="contrast-colors">
            <div
              class="contrast-color-box"
              :style="{ backgroundColor: pair.color1 }"
            ></div>
            <div
              class="contrast-color-box"
              :style="{ backgroundColor: pair.color2 }"
            ></div>
          </div>
          <div class="contrast-info">
            <div class="contrast-ratio">
              Контраст: {{ pair.ratio }}:1
            </div>
            <div class="contrast-badges">
              <span
                v-if="pair.wcag.AA"
                class="badge badge-success"
              >
                AA
              </span>
              <span
                v-if="pair.wcag.AAA"
                class="badge badge-success"
              >
                AAA
              </span>
              <span
                v-if="!pair.wcag.AA"
                class="badge badge-warning"
              >
                Недостаточно
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ColorCard from '../components/ColorCard.vue';
import PalettePreview from '../components/PalettePreview.vue';
import ColorWheel from '../components/ColorWheel.vue';
import {
  generateHarmoniousPalette,
  generateAnalogousPalette,
  generateMonochromePalette,
  generateTriadPalette,
  generateComplementaryPalette,
  generateMoodPalette,
  checkWCAG,
} from '../utils/colorUtils';
import { saveCurrentPalette, getCurrentPalette } from '../utils/storageUtils';
import { useRoute } from 'vue-router';
import { getSavedPalettes } from '../utils/storageUtils';

const route = useRoute();

const palette = ref([]);
const colorCount = ref(5);
const displayFormat = ref('hex');
const baseColor = ref('#FF6B6B');
const paletteType = ref('harmonious');
const lockedIndices = ref([]);
const selectedMood = ref(null);
const showColorWheel = ref(false);

const moods = [
  { value: 'calm', label: 'Спокойные', emoji: '🌊' },
  { value: 'energetic', label: 'Энергичные', emoji: '⚡' },
  { value: 'professional', label: 'Профессиональные', emoji: '💼' },
  { value: 'warm', label: 'Тёплые', emoji: '🔥' },
  { value: 'cool', label: 'Холодные', emoji: '❄️' },
];

const hasLockedColors = computed(() => lockedIndices.value.length > 0);

const contrastPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < palette.value.length; i++) {
    for (let j = i + 1; j < palette.value.length; j++) {
      const wcag = checkWCAG(palette.value[i], palette.value[j]);
      pairs.push({
        color1: palette.value[i],
        color2: palette.value[j],
        ratio: wcag.ratio,
        wcag,
      });
    }
  }
  return pairs;
});

const generatePalette = () => {
  const newPalette = [];
  const lockedColors = lockedIndices.value.map((idx) => palette.value[idx]);
  const newIndices = [];

  // Сохраняем заблокированные цвета
  lockedIndices.value.forEach((idx, i) => {
    newPalette[idx] = lockedColors[i];
    newIndices.push(idx);
  });

  // Генерируем остальные цвета
  let generatedColors = [];
  switch (paletteType.value) {
    case 'analogous':
      generatedColors = generateAnalogousPalette(baseColor.value, colorCount.value);
      break;
    case 'monochrome':
      generatedColors = generateMonochromePalette(baseColor.value, colorCount.value);
      break;
    case 'triad':
      generatedColors = generateTriadPalette(baseColor.value, colorCount.value);
      break;
    case 'complementary':
      generatedColors = generateComplementaryPalette(baseColor.value, colorCount.value);
      break;
    default:
      generatedColors = generateHarmoniousPalette(colorCount.value, baseColor.value);
  }

  // Заполняем незаблокированные позиции
  let genIndex = 0;
  for (let i = 0; i < colorCount.value; i++) {
    if (!newIndices.includes(i)) {
      newPalette[i] = generatedColors[genIndex % generatedColors.length];
      genIndex++;
    }
  }

  palette.value = newPalette.filter((c) => c !== undefined);
  saveCurrentPalette(palette.value);
};

const generateMoodPaletteHandler = (mood) => {
  selectedMood.value = mood;
  const generated = generateMoodPalette(mood, colorCount.value);
  const newPalette = [];
  const lockedColors = lockedIndices.value.map((idx) => palette.value[idx]);
  const newIndices = [];

  lockedIndices.value.forEach((idx, i) => {
    newPalette[idx] = lockedColors[i];
    newIndices.push(idx);
  });

  let genIndex = 0;
  for (let i = 0; i < colorCount.value; i++) {
    if (!newIndices.includes(i)) {
      newPalette[i] = generated[genIndex % generated.length];
      genIndex++;
    }
  }

  palette.value = newPalette.filter((c) => c !== undefined);
  saveCurrentPalette(palette.value);
};

const lockColor = (index) => {
  if (!lockedIndices.value.includes(index)) {
    lockedIndices.value.push(index);
  }
};

const unlockColor = (index) => {
  lockedIndices.value = lockedIndices.value.filter((i) => i !== index);
};

const clearLocks = () => {
  lockedIndices.value = [];
};

const handleColorCopy = (color) => {
  console.log('Скопирован цвет:', color);
};

// Загружаем сохранённую палитру при монтировании
onMounted(() => {
  // Проверяем, нужно ли загрузить палитру из библиотеки
  if (route.query.load) {
    const palettes = getSavedPalettes();
    const loadedPalette = palettes.find((p) => p.id === route.query.load);
    if (loadedPalette && loadedPalette.colors) {
      palette.value = loadedPalette.colors;
      colorCount.value = loadedPalette.colors.length;
      saveCurrentPalette(palette.value);
      return;
    }
  }
  
  const saved = getCurrentPalette();
  if (saved && saved.length > 0) {
    palette.value = saved;
    colorCount.value = saved.length;
  } else {
    generatePalette();
  }
});

// Сохраняем при изменении палитры
watch(palette, () => {
  saveCurrentPalette(palette.value);
}, { deep: true });
</script>

<style scoped>
.generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.generator-header {
  text-align: center;
  margin-bottom: 40px;
}

.generator-header h1 {
  font-size: 36px;
  color: #d63384;
  margin-bottom: 8px;
}

.generator-header p {
  font-size: 18px;
  color: #666;
}

.settings-panel,
.advanced-settings {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.advanced-settings h3 {
  color: #d63384;
  margin-bottom: 20px;
  font-size: 24px;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
}

.radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.radio-label:hover {
  background: rgba(255, 182, 193, 0.1);
}

.radio-label input[type="radio"] {
  margin: 0;
  cursor: pointer;
}

.radio-label input[type="radio"]:checked + span {
  color: #d63384;
  font-weight: 600;
}

.radio-label:has(input:checked) {
  background: rgba(214, 51, 132, 0.1);
  border-color: #d63384;
}

.color-picker-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-picker {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.color-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Courier New', monospace;
}

.color-wheel-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.toggle-wheel-btn {
  padding: 8px 16px;
  background: rgba(214, 51, 132, 0.1);
  border: 2px solid #d63384;
  border-radius: 12px;
  color: #d63384;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-wheel-btn:hover {
  background: rgba(214, 51, 132, 0.2);
  transform: translateY(-2px);
}

.color-wheel-wrapper {
  padding: 20px;
  background: rgba(255, 182, 193, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(214, 51, 132, 0.2);
}

.select-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  cursor: pointer;
}

.mood-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.mood-btn {
  padding: 10px 20px;
  border: 2px solid #ffb6c1;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.mood-btn:hover {
  background: rgba(255, 182, 193, 0.1);
  transform: translateY(-2px);
}

.mood-btn.active {
  background: rgba(214, 51, 132, 0.1);
  border-color: #d63384;
  color: #d63384;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.btn-generate,
.btn-clear {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-generate {
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(214, 51, 132, 0.4);
}

.btn-clear {
  background: white;
  color: #d63384;
  border: 2px solid #d63384;
}

.btn-clear:hover {
  background: rgba(214, 51, 132, 0.05);
  transform: translateY(-2px);
}

.palette-container {
  margin-bottom: 40px;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.preview-section,
.accessibility-section {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-section h3,
.accessibility-section h3 {
  color: #d63384;
  margin-bottom: 20px;
  font-size: 24px;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.contrast-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #ffb6c1;
}

.contrast-colors {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.contrast-color-box {
  flex: 1;
  height: 60px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contrast-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contrast-ratio {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.contrast-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.badge-warning {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}
</style>

