<template>
  <div class="home">
    <div class="hero">
      <h1 class="hero-title">Генератор цветовых палитр</h1>
      <p class="hero-subtitle">
        Создавайте гармоничные цветовые схемы для ваших проектов
      </p>
      <div class="hero-actions">
        <router-link to="/generator" class="btn btn-primary">
          Начать генерацию
        </router-link>
        <router-link to="/library" class="btn btn-secondary">
          Моя библиотека
        </router-link>
      </div>
    </div>
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Генерация палитр</h3>
        <p>Создавайте гармоничные цветовые схемы различными способами</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>Анализ доступности</h3>
        <p>Проверяйте контрастность по стандартам WCAG</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💾</div>
        <h3>Сохранение</h3>
        <p>Храните и организуйте ваши любимые палитры</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📤</div>
        <h3>Экспорт</h3>
        <p>Экспортируйте в CSS, SCSS, Tailwind и другие форматы</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%);
  border-radius: 24px;
  margin-bottom: 60px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #d63384;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 20px;
  color: #666;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(214, 51, 132, 0.4);
}

.btn-secondary {
  background: white;
  color: #d63384;
  border-color: #d63384;
}

.btn-secondary:hover {
  background: rgba(214, 51, 132, 0.05);
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 32px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(214, 51, 132, 0.15);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  color: #d63384;
  margin-bottom: 12px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}
</style>






