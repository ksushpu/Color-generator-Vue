<template>
  <div class="palette-preview" :class="{ 'dark-bg': isDarkBackground }">
    <div class="preview-controls">
      <button
        class="toggle-btn"
        @click="toggleBackground"
        :class="{ active: isDarkBackground }"
      >
        {{ isDarkBackground ? '🌙' : '☀️' }}
        {{ isDarkBackground ? 'Тёмный фон' : 'Светлый фон' }}
      </button>
    </div>
    <div class="preview-content">
      <div class="preview-header">
        <h2 class="preview-title" :style="{ color: colors[0] || '#333' }">
          Заголовок
        </h2>
        <p class="preview-subtitle" :style="{ color: colors[1] || '#666' }">
          Подзаголовок с описанием
        </p>
      </div>
      <div class="preview-card" :style="{ backgroundColor: colors[2] || '#fff', borderColor: colors[0] || '#ddd' }">
        <h3 :style="{ color: colors[0] || '#333' }">Карточка</h3>
        <p :style="{ color: colors[1] || '#666' }">
          Пример текста на карточке с использованием цветов палитры
        </p>
      </div>
      <button
        class="preview-button"
        :style="{
          backgroundColor: colors[0] || '#667eea',
          color: getContrastColor(colors[0] || '#667eea'),
        }"
      >
        Кнопка
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getLuminance } from '../utils/colorUtils';

defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
});

const isDarkBackground = ref(false);

const toggleBackground = () => {
  isDarkBackground.value = !isDarkBackground.value;
};

const getContrastColor = (hex) => {
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000' : '#fff';
};
</script>

<style scoped>
.palette-preview {
  background: linear-gradient(135deg, #ffeef5 0%, #fff5f9 100%);
  border-radius: 20px;
  padding: 24px;
  transition: background 0.3s ease;
}

.palette-preview.dark-bg {
  background: linear-gradient(135deg, #2d1b2e 0%, #1a0f1a 100%);
}

.preview-controls {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 182, 193, 0.5);
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #d63384;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark-bg .toggle-btn {
  background: rgba(45, 27, 46, 0.8);
  border-color: rgba(255, 182, 193, 0.3);
  color: #ffb6c1;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(214, 51, 132, 0.2);
}

.toggle-btn.active {
  background: rgba(214, 51, 132, 0.1);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  text-align: center;
}

.preview-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.preview-subtitle {
  font-size: 16px;
  opacity: 0.8;
  transition: color 0.3s ease;
}

.preview-card {
  padding: 24px;
  border-radius: 16px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.preview-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.preview-card p {
  font-size: 14px;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.preview-button {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
}

.preview-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
</style>






