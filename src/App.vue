<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">🎨 Генератор цветовых палитр</h1>
      <p class="app-subtitle">Создавайте гармоничные цветовые схемы для ваших проектов</p>
    </header>

    <!-- Навигация по секциям -->
    <nav class="section-nav">
      <router-link
        v-for="section in sections"
        :key="section.path"
        :to="section.path"
        class="nav-btn"
        active-class="active"
      >
        {{ section.icon }} {{ section.name }}
      </router-link>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>Генератор цветовых палитр • Vue 3 + Vite</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sections = [
  { path: '/', name: 'Главная', icon: '🏠' },
  { path: '/generator', name: 'Генератор', icon: '🎨' },
  { path: '/library', name: 'Библиотека', icon: '📚' },
  { path: '/export', name: 'Экспорт', icon: '📤' },
];
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #ffeef5 0%, #fff5f9 50%, #ffeef5 100%);
  background-attachment: fixed;
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%);
  padding: 40px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(214, 51, 132, 0.1);
}

.app-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.app-subtitle {
  font-size: 18px;
  color: #666;
}

.section-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(214, 51, 132, 0.1);
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 24px;
  border: 2px solid #ffb6c1;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #d63384;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.nav-btn:hover {
  background: rgba(255, 182, 193, 0.1);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: linear-gradient(135deg, #d63384 0%, #ff69b4 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.footer {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  text-align: center;
  padding: 24px;
  margin-top: auto;
  color: #666;
  border-top: 1px solid rgba(214, 51, 132, 0.1);
}

.footer p {
  margin: 0;
}
</style>
