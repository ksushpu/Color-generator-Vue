<template>
  <div
    class="color-card"
    :class="{ 'is-locked': isLocked, 'is-dark': isDark }"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="color-card-content">
      <div class="color-value">{{ displayValue }}</div>
      <div class="color-actions">
        <button
          class="action-btn lock-btn"
          :class="{ active: isLocked }"
          @click.stop="toggleLock"
          :title="isLocked ? 'Разблокировать' : 'Заблокировать'"
        >
          {{ isLocked ? '🔒' : '🔓' }}
        </button>
        <button
          class="action-btn copy-btn"
          @click.stop="copyToClipboard"
          title="Копировать"
        >
          📋
        </button>
      </div>
    </div>
    <transition name="notification">
      <div v-if="showNotification" class="notification">
        Скопировано!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { hexToRgb } from '../utils/colorUtils';

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'hex',
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['lock', 'unlock', 'copy']);

const showNotification = ref(false);
const isDark = computed(() => {
  const rgb = hexToRgb(props.color);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 299 + rgb.b * 114) / 1000;
  return brightness < 128;
});

const displayValue = computed(() => {
  if (props.format === 'rgb') {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
  }
  return props.color.toUpperCase();
});

const handleClick = () => {
  copyToClipboard();
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.color);
    showNotification.value = true;
    emit('copy', props.color);
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  } catch (err) {
    console.error('Ошибка копирования:', err);
  }
};

const toggleLock = () => {
  if (props.isLocked) {
    emit('unlock');
  } else {
    emit('lock');
  }
};
</script>

<style scoped>
.color-card {
  position: relative;
  min-height: 150px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.color-card.is-locked {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.color-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
}

.color-card.is-dark .color-card-content {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent);
  color: #333;
}

.color-value {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.color-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.color-card.is-dark .action-btn {
  background: rgba(0, 0, 0, 0.2);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.action-btn.active {
  background: rgba(255, 255, 255, 0.4);
}

.notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
  pointer-events: none;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}
</style>






