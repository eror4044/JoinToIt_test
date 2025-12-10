<script setup lang="ts">
import Sidebar from './components/layout/Sidebar.vue'
import Topbar from './components/layout/Topbar.vue'
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <div class="app-main">
      <Topbar />
      <main class="app-content">
        <div class="content-shell">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  height: 100vh;
  background: #f4f4fb;
  color: #2f2f3a;
}

.app-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-content {
  flex: 1 1 auto;
  min-height: 0;
  padding: 32px 40px 36px;
  background: linear-gradient(180deg, #f5f5fb 0%, #f0f1f8 100%);
  display: flex;
}

.content-shell {
  max-width: 1240px;
  margin: 0 auto;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .app-main {
    min-height: calc(100vh - 64px);
  }
}
</style>
