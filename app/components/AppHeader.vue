<script setup lang="ts">
import { computed, ref } from "vue";
import { onClickOutside, useWindowSize, useDark, useToggle } from "@vueuse/core";

const searchQuery = ref("");
const showNotifications = ref(false);
const showProfile = ref(false);
const showMobileSearch = ref(false);

// State untuk mobile sidebar (shared dengan Sidebar)
const isMobileOpen = useState<boolean>("sidebarMobileOpen", () => false);

// ===== @vueuse/core: Window Size =====
const { width } = useWindowSize();

// Reactive breakpoint check
const isMobile = computed(() => width.value < 1024);

// ===== @vueuse/core: Dark Mode =====
const isDark = useDark();
const toggleDark = useToggle(isDark);

const notifications = [
  { id: 1, title: "New order received", time: "5 min ago", unread: true },
  { id: 2, title: "Production completed", time: "1 hour ago", unread: true },
  { id: 3, title: "System maintenance", time: "2 hours ago", unread: false },
];

const unreadCount = computed(() => notifications.filter((n) => n.unread).length);

// ===== @vueuse/core: Click Outside =====
const notifDropdownRef = ref<HTMLElement | null>(null);
const profileDropdownRef = ref<HTMLElement | null>(null);

onClickOutside(notifDropdownRef, () => {
  showNotifications.value = false;
});

onClickOutside(profileDropdownRef, () => {
  showProfile.value = false;
});

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  showProfile.value = false;
}

function toggleProfile() {
  showProfile.value = !showProfile.value;
  showNotifications.value = false;
}

function toggleMobileSidebar() {
  isMobileOpen.value = !isMobileOpen.value;
}

function toggleMobileSearch() {
  showMobileSearch.value = !showMobileSearch.value;
}
</script>

<template>
  <header
    class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-colors"
  >
    <!-- Left -->
    <div class="flex items-center gap-3 lg:gap-4">
      <button
        class="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors"
        @click="toggleMobileSidebar"
      >
        <i class="fas fa-bars text-lg" />
      </button>

      <span class="lg:hidden text-lg font-bold text-gray-800 dark:text-white">
        AD<span class="text-green-600">MIN</span>
      </span>
    </div>
  </header>

  <!-- Mobile Search Bar -->
  <div
    v-if="showMobileSearch"
    class="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 p-4 z-20 md:hidden"
  >
    <div class="relative">
      <i
        class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        autofocus
      />
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
        @click="showMobileSearch = false"
      >
        <i class="fas fa-times" />
      </button>
    </div>
  </div>
</template>
