<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Admin Beranda",
});

const colorMode = useColorMode();

/* ================= STATS ================= */
const stats = [
  {
    title: "Total Artikel",
    value: 128,
    icon: "i-lucide-file-text",
    color: "emerald",
    bgGradient: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    trend: "+8%",
  },
  {
    title: "User Aktif",
    value: 54,
    icon: "i-lucide-users",
    color: "blue",
    bgGradient: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    trend: "+5%",
  },
  {
    title: "Komentar",
    value: 230,
    icon: "i-lucide-message-circle",
    color: "amber",
    bgGradient: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    trend: "+12%",
  },
  {
    title: "Draft",
    value: 12,
    icon: "i-lucide-edit-3",
    color: "violet",
    bgGradient: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    trend: "Pending",
  },
];

/* ================= WEEKLY TRAFFIC ================= */
const weeklySeries = [
  {
    name: "Pengunjung",
    data: [120, 210, 180, 250, 300, 200, 170],
  },
];

const weeklyOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: "transparent",
    foreColor: colorMode.value === "dark" ? "#94a3b8" : "#64748b",
  },
  theme: {
    mode: colorMode.value === "dark" ? "dark" : "light",
  },
  colors: ["#3b82f6"],
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "55%",
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  },
  tooltip: {
    y: {
      formatter: (val: number) => val + " visitor",
    },
  },
}));

/* ================= DONUT ================= */
const donutSeries = [40, 25, 20, 10, 5];

const donutOptions = computed(() => ({
  chart: { type: "donut" },
  labels: ["Artikel", "Berita", "Tutorial", "Video", "Lainnya"],
  colors: ["#22c55e", "#3b82f6", "#eab308", "#a855f7", "#64748b"],
  legend: { position: "bottom" },
}));

/* ================= RECENT CONTENT ================= */

type StatusColor =
  | "success"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "error"
  | "neutral";

type ContentItem = {
  title: string;
  category: string;
  author: string;
  time: string;
  status: string;
  statusColor: StatusColor;
  priority: "high" | "normal";
  views: number;
  likes: number;
  comments: number;
};

const contents: ContentItem[] = [
  {
    title: "Jadwal Dokter Spesialis April",
    category: "Informasi",
    author: "Admin",
    time: "10:30",
    status: "Published",
    statusColor: "success",
    priority: "high",
    views: 1200,
    likes: 120,
    comments: 12,
  },
  {
    title: "Tips Kesehatan Jantung",
    category: "Artikel",
    author: "Dr. Andi",
    time: "09:00",
    status: "Published",
    statusColor: "success",
    priority: "normal",
    views: 980,
    likes: 95,
    comments: 8,
  },
  {
    title: "Pengumuman Libur Lebaran",
    category: "Pengumuman",
    author: "Admin",
    time: "08:00",
    status: "Draft",
    statusColor: "warning",
    priority: "high",
    views: 0,
    likes: 0,
    comments: 0,
  },
];

const getStatusColor = (status: string): StatusColor => {
  if (status === "Published") return "success";
  if (status === "Draft") return "warning";
  return "info";
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Dashboard Admin</h1>
        <p class="text-slate-500">Monitoring konten website</p>
      </div>

      <UButton icon="i-lucide-plus" color="primary"> Tambah Artikel </UButton>
    </div>

    <!-- STATS -->
    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.title">
        <div class="flex justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ stat.title }}</p>
            <p class="text-3xl font-bold">{{ stat.value }}</p>
            <span class="text-xs">{{ stat.trend }}</span>
          </div>
          <UIcon :name="stat.icon" class="w-6 h-6" />
        </div>
      </UCard>
    </div>

    <!-- CHART -->
    <div class="grid xl:grid-cols-3 gap-6">
      <UCard class="xl:col-span-2">
        <h3 class="font-semibold mb-4">Traffic Mingguan</h3>
        <ClientOnly>
          <apexchart
            type="bar"
            height="300"
            :options="weeklyOptions"
            :series="weeklySeries"
          />
        </ClientOnly>
      </UCard>

      <UCard>
        <h3 class="font-semibold mb-4">Distribusi Konten</h3>
        <ClientOnly>
          <apexchart
            type="donut"
            height="300"
            :options="donutOptions"
            :series="donutSeries"
          />
        </ClientOnly>
      </UCard>
    </div>

    <!-- RECENT CONTENT -->
    <UCard class="bg-white dark:bg-slate-900/50 backdrop-blur-sm border-0 shadow-sm">
      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-white">
            Monitoring Konten Website
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Aktivitas update artikel & informasi rumah sakit
          </p>
        </div>

        <UButton
          size="sm"
          color="primary"
          variant="soft"
          trailing-icon="i-lucide-arrow-right"
        >
          Lihat Semua
        </UButton>
      </div>

      <!-- LIST -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in contents"
          :key="item.title"
          class="group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.01]"
        >
          <!-- LEFT -->
          <div class="flex items-center gap-4">
            <!-- ICON / CATEGORY -->
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md',
                item.category === 'Informasi'
                  ? 'bg-blue-500'
                  : item.category === 'Artikel'
                  ? 'bg-emerald-500'
                  : item.category === 'Pengumuman'
                  ? 'bg-amber-500'
                  : 'bg-violet-500',
              ]"
            >
              <UIcon
                :name="
                  item.category === 'Informasi'
                    ? 'i-lucide-info'
                    : item.category === 'Artikel'
                    ? 'i-lucide-file-text'
                    : item.category === 'Pengumuman'
                    ? 'i-lucide-megaphone'
                    : 'i-lucide-layout'
                "
                class="w-5 h-5"
              />
            </div>

            <!-- CONTENT INFO -->
            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold text-slate-800 dark:text-slate-200">
                  {{ item.title }}
                </p>

                <!-- PRIORITY -->
                <UIcon
                  v-if="item.priority === 'high'"
                  name="i-lucide-alert-circle"
                  class="w-4 h-4 text-red-500"
                />
              </div>

              <div class="flex items-center gap-2 text-xs mt-1 text-slate-500">
                <span>{{ item.category }}</span>
                <span>•</span>
                <span>{{ item.author }}</span>
                <span>•</span>
                <span>{{ item.time }}</span>
              </div>

              <!-- MINI INFO -->
              <div class="flex items-center gap-3 mt-2 text-xs">
                <span class="text-blue-500 flex items-center gap-1">
                  <UIcon name="i-lucide-eye" class="w-3 h-3" />
                  {{ item.views }} views
                </span>

                <span class="text-emerald-500 flex items-center gap-1">
                  <UIcon name="i-lucide-thumbs-up" class="w-3 h-3" />
                  {{ item.likes }}
                </span>

                <span class="text-amber-500 flex items-center gap-1">
                  <UIcon name="i-lucide-message-circle" class="w-3 h-3" />
                  {{ item.comments }}
                </span>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="flex items-center gap-3">
            <!-- STATUS -->
            <UBadge :color="getStatusColor(item.status)">
              <template #leading>
                <UIcon
                  :name="
                    item.status === 'Published'
                      ? 'i-lucide-check-circle'
                      : item.status === 'Draft'
                      ? 'i-lucide-edit'
                      : 'i-lucide-clock'
                  "
                  class="w-3.5 h-3.5 mr-1"
                />
              </template>
              {{ item.status }}
            </UBadge>

            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-more-horizontal"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
