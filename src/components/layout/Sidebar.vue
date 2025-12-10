<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <div class="brand">IMPEKABLE</div>
    <nav class="nav">
      <button class="nav-item">
        <IconMdiHomeOutline class="icon" aria-hidden="true" />
        <span>Home</span>
      </button>
      <button class="nav-item">
        <IconMdiViewDashboardOutline class="icon" aria-hidden="true" />
        <span>Dashboard</span>
      </button>
      <button class="nav-item">
        <IconMdiInboxArrowDownOutline class="icon" aria-hidden="true" />
        <span>Inbox</span>
      </button>
      <button class="nav-item">
        <IconMdiPackageVariant class="icon" aria-hidden="true" />
        <span>Products</span>
      </button>
      <button class="nav-item">
        <IconMdiFileDocumentOutline class="icon" aria-hidden="true" />
        <span>Invoices</span>
      </button>
      <button class="nav-item">
        <IconMdiAccountGroupOutline class="icon" aria-hidden="true" />
        <span>Customers</span>
      </button>
      <button class="nav-item">
        <IconMdiChatOutline class="icon" aria-hidden="true" />
        <span>Chat Room</span>
      </button>
      <button class="nav-item active">
        <IconMdiCalendarMonthOutline class="icon" aria-hidden="true" />
        <span>Calendar</span>
      </button>
      <button class="nav-item">
        <IconMdiHelpCircleOutline class="icon" aria-hidden="true" />
        <span>Help Center</span>
      </button>
      <button class="nav-item">
        <IconMdiCogOutline class="icon" aria-hidden="true" />
        <span>Settings</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #37334d 0%, #302b44 100%);
  color: #dcd9e7;
  min-height: 100vh;
  padding: 26px 0px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 6px 0 24px rgba(30, 26, 53, 0.2);
}

.brand {
  letter-spacing: 3px;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
  text-transform: uppercase;
  padding-left: 18px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  position: relative;
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.active {
  background: #34304a;
  color: #b8a4ff;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: #c289ff;
}

.icon {
  width: 18px;
  height: 18px;
  color: #c9c5d8;
}

.nav-item.active .icon {
  color: #b8a4ff;
}

@media (max-width: 960px) {
  .sidebar {
    flex-direction: row;
    align-items: center;
    min-height: auto;
    padding: 12px 16px;
    gap: 12px;
    overflow-x: auto;
  }

  .nav {
    flex-direction: row;
    gap: 8px;
  }

  .nav-item {
    grid-template-columns: 1fr;
    padding: 8px 10px;
  }

  .nav-item span:not(.icon) {
    display: none;
  }
}
</style>
