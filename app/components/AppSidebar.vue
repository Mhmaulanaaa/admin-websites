<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  onClickOutside,
  useWindowSize,
  useStorage,
  useDark,
  useToggle
} from '@vueuse/core'

const route = useRoute()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 1024)

const isCollapsed = useStorage('sidebar-collapsed', false)
const isMobileOpen = useState<boolean>('sidebarMobileOpen', () => false)

// Dark mode state
const isDark = useDark()
const toggleDark = useToggle(isDark)

watch(isMobile, (mobile) => {
  if (!mobile) isMobileOpen.value = false
})

interface Menu {
  name: string
  icon: string
  to: string
}

const menus: Menu[] = [
  { name: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  { name: 'Booking', icon: 'heroicons:calendar-days', to: '/booking' },
  {
    name: 'Verifikasi Pra-Bedah',
    icon: 'heroicons:clipboard-document-check',
    to: '/verifikasi-pra-bedah'
  },
  {
    name: 'Manajemen IBP',
    icon: 'heroicons:building-office-2',
    to: '/manajemen-ibp'
  },
  {
    name: 'Serah Terima',
    icon: 'heroicons:arrows-right-left',
    to: '/serah-terima'
  },
  {
    name: 'Durante Operasi',
    icon: 'heroicons:plus-circle',
    to: '/durante-operasi'
  },
  { name: 'Laporan', icon: 'heroicons:document-text', to: '/laporan' }
]

const currentPath = computed(() => route.path)

function isActiveMenu(item: Menu): boolean {
  return currentPath.value.startsWith(item.to)
}

const sidebarRef = ref<HTMLElement | null>(null)

onClickOutside(sidebarRef, () => {
  if (isMobile.value && isMobileOpen.value) {
    isMobileOpen.value = false
  }
})

function toggleSidebar() {
  if (isMobile.value) {
    isMobileOpen.value = !isMobileOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <div>
    <!-- Overlay Mobile dengan Glassmorphism -->
    <Transition name="fade">
      <div
        v-if="isMobileOpen && isMobile"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
        @click="isMobileOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      ref="sidebarRef"
      :class="[
        'flex flex-col transition-all duration-500 ease-in-out h-screen fixed lg:sticky top-0 shrink-0 z-50',
        'bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl',
        'border-r border-gray-200/50 dark:border-slate-700/50',
        'shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]',
        'lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'lg:w-72',
        'w-80',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Header dengan Gradient -->
      <div
        :class="[
          'h-16 flex items-center px-5 border-b border-gray-200/50 dark:border-slate-700/50',
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        ]"
      >
        <div
          :class="[
            'flex items-center gap-3 transition-all duration-500',
            isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
          ]"
        >
          <div class="relative">
            <div
              class="absolute inset-0 bg-green-500 blur-lg opacity-30 rounded-full"
            />
            <div
              class="relative w-10 h-10 rounded-xl bg-linear-to-brrom-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg"
            >
              <img
                src="/logo.png"
                alt="Logo"
                class="w-12 h-12 object-contain"
              >
            </div>
          </div>
          <div>
            <h1
              class="text-xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
            >
              OPTI<span class="text-green-500">MUM</span>
            </h1>
          </div>
        </div>

        <button
          class="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700/50"
          @click="toggleSidebar"
        >
          <UIcon
            name="heroicons:bars-3"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            :class="{ 'rotate-180': isCollapsed && !isMobile }"
          />
        </button>
      </div>

      <!-- Menu dengan Hover Effects -->
      <nav
        class="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <NuxtLink
          v-for="(item, index) in menus"
          :key="item.name"
          :to="item.to"
          :class="[
            'relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden',
            isCollapsed ? 'lg:justify-center' : '',
            isActiveMenu(item)
              ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 dark:shadow-green-500/20 scale-[1.02]'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
          ]"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Background Hover Effect -->
          <div
            v-if="!isActiveMenu(item)"
            class="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/5 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />

          <!-- Active Indicator -->
          <div
            v-if="isActiveMenu(item)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />

          <!-- Icon dengan Glow Effect -->
          <div class="relative">
            <div
              v-if="isActiveMenu(item)"
              class="absolute inset-0 bg-white/30 blur-md rounded-full"
            />
            <UIcon
              :name="item.icon"
              class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110"
              :class="
                isActiveMenu(item)
                  ? 'text-white'
                  : 'group-hover:text-green-500 dark:group-hover:text-green-400'
              "
            />
          </div>

          <!-- Text dengan Animation -->
          <span
            :class="[
              'relative z-10 font-medium whitespace-nowrap transition-all duration-500',
              isCollapsed
                ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                : 'opacity-100'
            ]"
          >
            {{ item.name }}
          </span>

          <!-- Active Arrow -->
          <UIcon
            v-if="isActiveMenu(item) && !isCollapsed"
            name="heroicons:chevron-right"
            class="w-4 h-4 ml-auto opacity-70"
          />
        </NuxtLink>
      </nav>

      <!-- Dark Mode Toggle Section -->
      <div class="px-3 pb-2">
        <button
          :class="[
            'w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group',
            'bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700/50',
            'border border-gray-200 dark:border-slate-700/50',
            isCollapsed ? 'lg:justify-center' : ''
          ]"
          @click="toggleDark()"
        >
          <div class="relative w-5 h-5">
            <UIcon
              name="heroicons:sun"
              class="w-5 h-5 absolute inset-0 text-amber-500 transition-all duration-500 rotate-0 scale-100 dark:rotate-90 dark:scale-0"
            />
            <UIcon
              name="heroicons:moon"
              class="w-5 h-5 absolute inset-0 text-indigo-400 transition-all duration-500 -rotate-90 scale-0 dark:rotate-0 dark:scale-100"
            />
          </div>
          <span
            :class="[
              'text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap transition-all duration-500',
              isCollapsed
                ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                : 'opacity-100'
            ]"
          >
            {{ isDark ? "Mode Gelap" : "Mode Terang" }}
          </span>
        </button>
      </div>

      <!-- Footer dengan Glass Effect -->
      <div
        class="p-4 mx-3 mb-3 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm"
      >
        <div
          :class="[
            'flex items-center gap-3',
            isCollapsed ? 'lg:justify-center' : ''
          ]"
        >
          <div class="relative group">
            <div
              class="absolute inset-0 bg-green-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"
            />
            <div
              class="relative w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-slate-800"
            >
              AA
            </div>
            <div
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"
            />
          </div>

          <div
            :class="[
              'flex-1 min-w-0 transition-all duration-500',
              isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
            ]"
          >
            <p
              class="font-semibold text-sm text-gray-800 dark:text-slate-200 truncate"
            >
              Andri Aprilianzah
            </p>
            <p
              class="text-xs text-green-600 dark:text-green-400 font-medium truncate"
            >
              Administrator
            </p>
          </div>

          <button
            :class="[
              'p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300',
              isCollapsed ? 'lg:hidden' : ''
            ]"
          >
            <UIcon
              name="heroicons:arrow-right-on-rectangle"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth Scroll Behavior */
nav {
  scroll-behavior: smooth;
}

/* Selection Color */
::selection {
  background-color: rgba(34, 197, 94, 0.2);
  color: inherit;
}
</style>
