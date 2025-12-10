<script setup lang="ts"></script>

<template>
  <header class="topbar">
    <div class="search">
      <IconMdiMagnify class="glyph icon" aria-hidden="true" />
      <input placeholder="Search transactions, invoices or help" />
    </div>
    <div class="actions">
      <button class="icon-btn" aria-label="settings">
        <IconMdiCogOutline class="glyph icon" aria-hidden="true" />
      </button>
      <button class="icon-btn bell-btn" aria-label="notifications">
        <IconMdiBellOutline class="glyph icon" aria-hidden="true" />
      </button>
      <button class="icon-btn" aria-label="messages">
        <IconMdiChatOutline class="glyph icon" aria-hidden="true" />
      </button>
      <div class="profile">
        <div class="avatar">JD</div>
        <span class="name">John Doe</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding:14px 24px 14px 0px;
  background: #ffffff;
  border-bottom: 1px solid #e6e8ef;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  background: transparent;
  flex: 1;
}

.glyph.search {
  width: 18px;
  height: 18px;
  color: #8f96aa;
}

.search input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #5b6274;
  padding: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: #e9ecf7;
}

.bell-btn {
  position: relative;
}

.bell-btn::after {
  content: '';
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffb547;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 14px;
  border-left: 1px solid #e6e8ef;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7d7aff, #5791ff);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.name {
  font-weight: 600;
  color: #3c3f50;
}

.glyph.icon {
  width: 18px;
  height: 18px;
  color: #b3b7c8;
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .actions {
    justify-content: flex-end;
  }
}
</style>
