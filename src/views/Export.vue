<template>
  <div class="export">
    <div class="export-header">
      <h1>Экспорт палитры</h1>
      <p>Экспортируйте цвета в различные форматы</p>
    </div>

    <div v-if="!currentPalette || currentPalette.length === 0" class="empty-state">
      <p>Нет палитры для экспорта. Сгенерируйте палитру в разделе "Генератор"</p>
      <router-link to="/generator" class="btn-link">
        Перейти к генератору
      </router-link>
    </div>

    <div v-else>
      <!-- Предпросмотр палитры -->
      <div class="palette-preview-section">
        <h3>Текущая палитра</h3>
        <div class="preview-palette">
          <div
            v-for="(color, index) in currentPalette"
            :key="index"
            class="preview-color"
            :style="{ backgroundColor: color }"
          >
            <span class="color-hex">{{ color.toUpperCase() }}</span>
          </div>
        </div>
      </div>

      <!-- Форматы экспорта -->
      <div class="export-formats">
        <h3>Выберите формат экспорта</h3>
        <div class="format-tabs">
          <button
            v-for="format in formats"
            :key="format.id"
            @click="selectedFormat = format.id"
            class="format-tab"
            :class="{ active: selectedFormat === format.id }"
          >
            {{ format.name }}
          </button>
        </div>

        <!-- CSS Variables -->
        <div v-if="selectedFormat === 'css'" class="export-output">
          <h4>CSS Variables</h4>
          <pre class="code-block"><code>{{ cssVariables }}</code></pre>
          <button @click="copyToClipboard(cssVariables)" class="btn-copy">
            📋 Копировать
          </button>
        </div>

        <!-- SCSS Variables -->
        <div v-if="selectedFormat === 'scss'" class="export-output">
          <h4>SCSS Variables</h4>
          <pre class="code-block"><code>{{ scssVariables }}</code></pre>
          <button @click="copyToClipboard(scssVariables)" class="btn-copy">
            📋 Копировать
          </button>
        </div>

        <!-- Tailwind Config -->
        <div v-if="selectedFormat === 'tailwind'" class="export-output">
          <h4>Tailwind Config</h4>
          <pre class="code-block"><code>{{ tailwindConfig }}</code></pre>
          <button @click="copyToClipboard(tailwindConfig)" class="btn-copy">
            📋 Копировать
          </button>
        </div>

        <!-- CSS Code -->
        <div v-if="selectedFormat === 'css-code'" class="export-output">
          <h4>CSS Code</h4>
          <pre class="code-block"><code>{{ cssCode }}</code></pre>
          <button @click="copyToClipboard(cssCode)" class="btn-copy">
            📋 Копировать
          </button>
        </div>

        <!-- JSON -->
        <div v-if="selectedFormat === 'json'" class="export-output">
          <h4>JSON</h4>
          <pre class="code-block"><code>{{ jsonOutput }}</code></pre>
          <button @click="copyToClipboard(jsonOutput)" class="btn-copy">
            📋 Копировать
          </button>
        </div>
      </div>

      <!-- Превью UI компонентов -->
      <div class="ui-preview-section">
        <h3>Превью в UI компонентах</h3>
        <div class="ui-components">
          <div class="ui-component">
            <h4>Кнопки</h4>
            <div class="ui-buttons">
              <button
                v-for="(color, idx) in currentPalette.slice(0, 3)"
                :key="idx"
                class="ui-button"
                :style="{
                  backgroundColor: color,
                  color: getContrastColor(color),
                }"
              >
                Кнопка {{ idx + 1 }}
              </button>
            </div>
          </div>

          <div class="ui-component">
            <h4>Карточки</h4>
            <div class="ui-cards">
              <div
                v-for="(color, idx) in currentPalette.slice(0, 3)"
                :key="idx"
                class="ui-card"
                :style="{
                  borderTopColor: color,
                }"
              >
                <h5>Заголовок карточки</h5>
                <p>Текст карточки с использованием цвета палитры</p>
              </div>
            </div>
          </div>

          <div class="ui-component">
            <h4>Заголовки</h4>
            <div class="ui-headings">
              <h1
                v-for="(color, idx) in currentPalette.slice(0, 3)"
                :key="idx"
                :style="{ color }"
              >
                Заголовок {{ idx + 1 }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаринг -->
      <div class="share-section">
        <h3>Поделиться палитрой</h3>
        <div class="share-options">
          <button @click="generateShareLink" class="btn-share">
            🔗 Создать ссылку
          </button>
          <div v-if="shareLink" class="share-link">
            <input
              :value="shareLink"
              readonly
              class="share-input"
            />
            <button @click="copyToClipboard(shareLink)" class="btn-copy-small">
              📋
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getCurrentPalette } from '../utils/storageUtils';
import { getLuminance } from '../utils/colorUtils';

const currentPalette = ref([]);
const selectedFormat = ref('css');

const formats = [
  { id: 'css', name: 'CSS Variables' },
  { id: 'scss', name: 'SCSS Variables' },
  { id: 'tailwind', name: 'Tailwind Config' },
  { id: 'css-code', name: 'CSS Code' },
  { id: 'json', name: 'JSON' },
];

const cssVariables = computed(() => {
  return `:root {\n${currentPalette.value
    .map((color, idx) => `  --color-${idx + 1}: ${color};`)
    .join('\n')}\n}`;
});

const scssVariables = computed(() => {
  return `$colors: (\n${currentPalette.value
    .map((color, idx) => `  'color-${idx + 1}': ${color},`)
    .join('\n')}\n);`;
});

const tailwindConfig = computed(() => {
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${currentPalette.value
    .map((color, idx) => `        'palette-${idx + 1}': '${color}',`)
    .join('\n')}\n      }\n    }\n  }\n}`;
});

const cssCode = computed(() => {
  return `.palette {\n${currentPalette.value
    .map((color, idx) => `  --color-${idx + 1}: ${color};`)
    .join('\n')}\n}\n\n${currentPalette.value
    .map(
      (color, idx) =>
        `.color-${idx + 1} {\n  color: ${color};\n}\n\n.bg-color-${idx + 1} {\n  background-color: ${color};\n}`
    )
    .join('\n\n')}`;
});

const jsonOutput = computed(() => {
  return JSON.stringify(
    {
      palette: currentPalette.value,
      colors: currentPalette.value.map((color, idx) => ({
        name: `color-${idx + 1}`,
        value: color,
      })),
    },
    null,
    2
  );
});

const shareLink = ref('');

const getContrastColor = (hex) => {
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000' : '#fff';
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Скопировано в буфер обмена!');
  } catch (err) {
    console.error('Ошибка копирования:', err);
    alert('Не удалось скопировать');
  }
};

const generateShareLink = () => {
  const colors = currentPalette.value.join(',');
  const encoded = btoa(colors);
  shareLink.value = `${window.location.origin}${window.location.pathname}?palette=${encoded}`;
};

onMounted(() => {
  currentPalette.value = getCurrentPalette() || [];
});
</script>

<style scoped>
.export {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.export-header {
  text-align: center;
  margin-bottom: 40px;
}

.export-header h1 {
  font-size: 36px;
  color: #d63384;
  margin-bottom: 8px;
}

.export-header p {
  font-size: 18px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn-link {
  display: inline-block;
  margin-top: 16px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.palette-preview-section,
.export-formats,
.ui-preview-section,
.share-section {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.palette-preview-section h3,
.export-formats h3,
.ui-preview-section h3,
.share-section h3 {
  color: #d63384;
  margin-bottom: 20px;
  font-size: 24px;
}

.preview-palette {
  display: flex;
  gap: 8px;
  border-radius: 12px;
  overflow: hidden;
}

.preview-color {
  flex: 1;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-hex {
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
}

.format-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.format-tab {
  padding: 12px 24px;
  border: 2px solid #ffb6c1;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #d63384;
  transition: all 0.2s ease;
}

.format-tab:hover {
  background: rgba(255, 182, 193, 0.1);
}

.format-tab.active {
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  border-color: transparent;
}

.export-output {
  margin-top: 24px;
}

.export-output h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 18px;
}

.code-block {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #ffb6c1;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.btn-copy {
  padding: 10px 20px;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-copy:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.ui-components {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ui-component h4 {
  color: #d63384;
  margin-bottom: 16px;
  font-size: 20px;
}

.ui-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ui-button {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ui-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ui-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.ui-card {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border-top: 4px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ui-card h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.ui-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.ui-headings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ui-headings h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-share {
  padding: 12px 24px;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.share-link {
  display: flex;
  gap: 8px;
}

.share-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
}

.btn-copy-small {
  padding: 12px 16px;
  background: #d63384;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.btn-copy-small:hover {
  background: #ff69b4;
  transform: scale(1.05);
}
</style>






