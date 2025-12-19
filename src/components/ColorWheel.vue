<template>
  <div class="color-wheel-container">
    <canvas
      ref="canvasRef"
      :width="size"
      :height="size"
      class="color-wheel"
      @click="handleClick"
      @mousemove="handleMouseMove"
    ></canvas>
    <div v-if="selectedColor" class="selected-color-info">
      <div
        class="color-preview"
        :style="{ backgroundColor: selectedColor }"
      ></div>
      <div class="color-value">{{ selectedColor }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { rgbToHex, hslToRgb } from '../utils/colorUtils';

const props = defineProps({
  size: {
    type: Number,
    default: 300,
  },
  modelValue: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const canvasRef = ref(null);
const selectedColor = ref(props.modelValue);

const drawColorWheel = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = props.size / 2;
  const centerY = props.size / 2;
  const radius = props.size / 2 - 10;

  for (let angle = 0; angle < 360; angle += 0.5) {
    for (let r = 0; r < radius; r += 1) {
      const x = centerX + r * Math.cos((angle * Math.PI) / 180);
      const y = centerY + r * Math.sin((angle * Math.PI) / 180);

      const h = angle;
      const s = (r / radius) * 100;
      const l = 50;

      const rgb = hslToRgb(h, s, l);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }
};

const getColorAtPoint = (x, y) => {
  const canvas = canvasRef.value;
  if (!canvas) return null;

  const centerX = props.size / 2;
  const centerY = props.size / 2;
  const radius = props.size / 2 - 10;

  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius) return null;

  // Вычисляем угол относительно положительной оси X
  // Math.atan2 возвращает угол в диапазоне [-180, 180]
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  // Преобразуем в диапазон [0, 360]
  angle = (angle + 360) % 360;
  // Инвертируем направление обхода (360 - angle), чтобы соответствовать отрисовке
  angle = (360 - angle) % 360;
  const s = (distance / radius) * 100;
  const l = 50;

  const rgb = hslToRgb(angle, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

const handleClick = (event) => {
  const rect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const color = getColorAtPoint(x, y);
  if (color) {
    selectedColor.value = color;
    emit('update:modelValue', color);
    emit('change', color);
  }
};

const handleMouseMove = (event) => {
  // Можно добавить превью цвета при наведении
};

watch(() => props.modelValue, (newVal) => {
  selectedColor.value = newVal;
});

onMounted(() => {
  drawColorWheel();
});
</script>

<style scoped>
.color-wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.color-wheel {
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: crosshair;
}

.selected-color-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.color-preview {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
}

.color-value {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>






