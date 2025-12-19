<template>
  <div class="library">
    <div class="library-header">
      <h1>Моя библиотека</h1>
      <p>Управляйте сохранёнными палитрами</p>
    </div>

    <!-- Форма сохранения текущей палитры -->
    <div class="save-palette-form" v-if="currentPalette && currentPalette.length > 0">
      <h3>Сохранить текущую палитру</h3>
      <div class="form-group">
        <input
          v-model="newPaletteName"
          type="text"
          placeholder="Название палитры"
          class="input-field"
        />
        <input
          v-model="newPaletteTags"
          type="text"
          placeholder="Теги (через запятую)"
          class="input-field"
        />
        <button @click="saveCurrentPalette" class="btn-save">
          💾 Сохранить
        </button>
      </div>
    </div>

    <!-- Поиск и фильтрация -->
    <div class="search-section">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Поиск по названию или тегам..."
        class="search-input"
      />
    </div>

    <!-- Список палитр -->
    <div class="palettes-grid" v-if="filteredPalettes.length > 0">
      <div
        v-for="palette in filteredPalettes"
        :key="palette.id"
        class="palette-card"
      >
        <div class="palette-card-header">
          <h3>{{ palette.name || 'Без названия' }}</h3>
          <div class="palette-actions">
            <button
              @click="loadPalette(palette)"
              class="action-icon"
              title="Загрузить"
            >
              📥
            </button>
            <button
              @click="editPalette(palette)"
              class="action-icon"
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              @click="deletePalette(palette.id)"
              class="action-icon"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>
        <div class="palette-colors">
          <div
            v-for="(color, idx) in palette.colors"
            :key="idx"
            class="palette-color-item"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>
        <div class="palette-meta">
          <div class="palette-tags" v-if="palette.tags && palette.tags.length > 0">
            <span
              v-for="tag in palette.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="palette-date">
            {{ formatDate(palette.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>Нет сохранённых палитр</h3>
      <p>Сохраните палитру из генератора, чтобы она появилась здесь</p>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="editingPalette" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Редактировать палитру</h3>
        <div class="form-group">
          <label>Название:</label>
          <input
            v-model="editForm.name"
            type="text"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label>Теги:</label>
          <input
            v-model="editForm.tags"
            type="text"
            class="input-field"
            placeholder="Через запятую"
          />
        </div>
        <div class="modal-actions">
          <button @click="saveEdit" class="btn-primary">Сохранить</button>
          <button @click="closeEditModal" class="btn-secondary">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  getSavedPalettes,
  savePalette,
  deletePalette as deletePaletteUtil,
  updatePalette,
} from '../utils/storageUtils';
import { getCurrentPalette } from '../utils/storageUtils';

const router = useRouter();

const palettes = ref([]);
const searchQuery = ref('');
const newPaletteName = ref('');
const newPaletteTags = ref('');
const currentPalette = ref(null);
const editingPalette = ref(null);
const editForm = ref({ name: '', tags: '' });

const filteredPalettes = computed(() => {
  if (!searchQuery.value) return palettes.value;

  const query = searchQuery.value.toLowerCase();
  return palettes.value.filter((palette) => {
    const nameMatch = palette.name?.toLowerCase().includes(query);
    const tagsMatch = palette.tags?.some((tag) =>
      tag.toLowerCase().includes(query)
    );
    return nameMatch || tagsMatch;
  });
});

const loadPalettes = () => {
  palettes.value = getSavedPalettes();
};

const saveCurrentPalette = () => {
  if (!currentPalette.value || currentPalette.value.length === 0) {
    alert('Нет палитры для сохранения');
    return;
  }

  const tags = newPaletteTags.value
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t);

  const palette = {
    name: newPaletteName.value || `Палитра ${new Date().toLocaleDateString()}`,
    colors: currentPalette.value,
    tags,
  };

  savePalette(palette);
  loadPalettes();
  newPaletteName.value = '';
  newPaletteTags.value = '';
  alert('Палитра сохранена!');
};

const loadPalette = (palette) => {
  router.push({
    name: 'Generator',
    query: { load: palette.id },
  });
};

const editPalette = (palette) => {
  editingPalette.value = palette;
  editForm.value = {
    name: palette.name || '',
    tags: palette.tags?.join(', ') || '',
  };
};

const saveEdit = () => {
  if (!editingPalette.value) return;

  const tags = editForm.value.tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t);

  updatePalette(editingPalette.value.id, {
    name: editForm.value.name,
    tags,
  });

  loadPalettes();
  closeEditModal();
};

const closeEditModal = () => {
  editingPalette.value = null;
  editForm.value = { name: '', tags: '' };
};

const deletePalette = (id) => {
  if (confirm('Вы уверены, что хотите удалить эту палитру?')) {
    deletePaletteUtil(id);
    loadPalettes();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  loadPalettes();
  currentPalette.value = getCurrentPalette();
});
</script>

<style scoped>
.library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.library-header {
  text-align: center;
  margin-bottom: 40px;
}

.library-header h1 {
  font-size: 36px;
  color: #d63384;
  margin-bottom: 8px;
}

.library-header p {
  font-size: 18px;
  color: #666;
}

.save-palette-form {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.save-palette-form h3 {
  color: #d63384;
  margin-bottom: 16px;
  font-size: 20px;
}

.form-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.input-field {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  font-size: 16px;
}

.btn-save {
  padding: 12px 24px;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.search-section {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #ffb6c1;
  border-radius: 12px;
  font-size: 16px;
  background: white;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.palette-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.palette-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(214, 51, 132, 0.15);
}

.palette-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.palette-card-header h3 {
  color: #d63384;
  font-size: 20px;
  margin: 0;
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s ease;
}

.action-icon:hover {
  transform: scale(1.2);
}

.palette-colors {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  height: 60px;
}

.palette-color-item {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.palette-color-item:hover {
  transform: scale(1.1);
  z-index: 1;
}

.palette-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.palette-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  background: rgba(214, 51, 132, 0.1);
  color: #d63384;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.palette-date {
  font-size: 12px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #d63384;
  margin-bottom: 8px;
}

.empty-state p {
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  color: #d63384;
  margin-bottom: 24px;
  font-size: 24px;
}

.modal-content .form-group {
  flex-direction: column;
  margin-bottom: 20px;
}

.modal-content label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
}

.btn-secondary {
  background: white;
  color: #d63384;
  border: 2px solid #d63384;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
}
</style>






