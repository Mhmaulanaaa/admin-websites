<script setup lang="ts">
import { ref, computed } from "vue";
import { toastSuccess } from "~/utils/toast";
import { confirmAction } from "~/utils/swal";

import BaseStatCard from "~/components/form/BaseStatCard.vue";
import BaseTable from "~/components/form/BaseTable.vue";
import BaseModalTransaksiPodkiesJatim from "~/components/base/transaksi/BaseModalTransaksiPodkiesJatim.vue";

useHead({
  title: "Admin Transaksi Podkies Jatim",
});

definePageMeta({
  breadcrumb: [{ label: "Transaksi", to: "/transaksi" }, { label: "Podkies Jatim" }],
});

/* =====================
   STATE
===================== */
const showModal = ref(false);
const isEdit = ref(false);
const editIndex = ref<number | null>(null);

const dataTable = ref([
  {
    kode_podkiesjatim: "POD20260508001",
    link_embed: "https://www.youtube.com/watch?v=GAGcgPsqG28",
    status: "aktif",
  },
  {
    kode_podkiesjatim: "POD20260508002",
    link_embed: "https://www.youtube.com/watch?v=6KHUnR-iwhM",
    status: "tidak_aktif",
  },
]);

function getYoutubeId(url: string) {
  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;

  const match = url.match(regExp);

  return match ? match[1] : "";
}

function getYoutubeThumbnail(url: string) {
  const id = getYoutubeId(url);

  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/* =====================
   MODAL
===================== */
const selectedData = ref<any>(null);

function openCreate() {
  selectedData.value = null;
  isEdit.value = false;
  editIndex.value = null;
  showModal.value = true;
}

function openEdit(index: number) {
  selectedData.value = dataTable.value[index];
  editIndex.value = index;
  isEdit.value = true;
  showModal.value = true;
}

function handleSave(data: any) {
  if (isEdit.value && editIndex.value !== null) {
    dataTable.value[editIndex.value] = data;
    toastSuccess("Instagram Feed berhasil diubah");
  } else {
    dataTable.value.push(data);
    toastSuccess("Instagram Feed berhasil ditambahkan");
  }
}

/* =====================
   DELETE
===================== */
async function deleteFeed(index: number) {
  const result = await confirmAction(
    "Apakah Anda yakin ingin menghapus Instagram Feed ini?"
  );

  if (!result.isConfirmed) return;

  dataTable.value.splice(index, 1);

  toastSuccess("Instagram Feed berhasil dihapus");
}

/* =====================
   FILTER
===================== */
const filterStatusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
];

const kodeFilter = ref<string | undefined>();
const statusFilter = ref<string | undefined>();

const appliedFilter = ref({
  kode: undefined as string | undefined,
  status: undefined as string | undefined,
});

const kodeOptions = computed(() =>
  dataTable.value.map((item) => ({
    label: item.kode_podkiesjatim,
    value: item.kode_podkiesjatim,
  }))
);

function handleSearch() {
  appliedFilter.value = {
    kode: kodeFilter.value,
    status: statusFilter.value,
  };
}

function handleReset() {
  kodeFilter.value = undefined;
  statusFilter.value = undefined;

  appliedFilter.value = {
    kode: undefined,
    status: undefined,
  };
}

/* =====================
   FILTERED DATA
===================== */
const filteredData = computed(() => {
  return dataTable.value.filter((item) => {
    const matchKode =
      !appliedFilter.value.kode || item.kode_podkiesjatim === appliedFilter.value.kode;

    const matchStatus =
      !appliedFilter.value.status || item.status === appliedFilter.value.status;

    return matchKode && matchStatus;
  });
});

/* =====================
   NEXT NUMBER
===================== */
const nextNumber = computed(() => {
  return dataTable.value.length + 1;
});

/* =====================
   STATISTIK
===================== */
const statistik = computed(() => ({
  total: dataTable.value.length,
  aktif: dataTable.value.filter((i) => i.status === "aktif").length,
  tidak: dataTable.value.filter((i) => i.status === "tidak_aktif").length,
}));

/* =====================
   INTERFACE
===================== */
interface Feed {
  kode_podkiesjatim: string;
  link_embed: string;
  status: string;
}

/* =====================
   TABLE
===================== */
const columns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "kode_podkiesjatim", header: "Kode Podkies Jatim" },
  { accessorKey: "link_embed", header: "Link Embed" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "actions", header: "Aksi" },
];
</script>

<template>
  <!-- HEADER -->
  <div class="mb-4">
    <h1 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
      Transaksi Podkies Jatim
    </h1>

    <AppBreadcrumb />
  </div>

  <!-- STATISTIK -->
  <div class="grid grid-cols-3 gap-4 mb-6">
    <BaseStatCard
      title="Total Podkies Jatim"
      :value="statistik.total"
      color="from-blue-500 to-blue-600"
      iconColor="text-blue-200"
      textColor="text-blue-100"
    />

    <BaseStatCard
      title="Podkies Jatim Aktif"
      :value="statistik.aktif"
      color="from-green-500 to-green-600"
      iconColor="text-white-200"
      textColor="text-white-100"
    />

    <BaseStatCard
      title="Podkies Jatim Tidak Aktif"
      :value="statistik.tidak"
      color="from-red-500 to-red-600"
      iconColor="text-white-200"
      textColor="text-white-100"
    />
  </div>

  <!-- FILTER -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-5"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- KODE -->
      <USelectMenu
        v-model="kodeFilter"
        :items="kodeOptions"
        value-key="value"
        label-key="label"
        placeholder="Pilih Kode Podkies Jatim"
        class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
      />

      <!-- STATUS -->
      <USelectMenu
        v-model="statusFilter"
        :items="filterStatusOptions"
        value-key="value"
        label-key="label"
        placeholder="Pilih Status"
        class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
      />
    </div>

    <div class="flex items-center gap-2 mt-5">
      <button
        @click="handleSearch"
        class="bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-white" />
        Cari
      </button>

      <button
        @click="handleReset"
        class="bg-red-500 dark:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 dark:hover:bg-red-700 transition flex items-center gap-2 shadow-sm"
      >
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-white" />
        Muat Ulang
      </button>
    </div>
  </div>

  <!-- TABLE -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
  >
    <!-- BUTTON -->
    <div class="flex justify-end mb-4">
      <button
        @click="openCreate"
        class="bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
      >
        <UIcon name="i-heroicons-plus-circle" class="w-5 h-5" />
        Tambah
      </button>
    </div>

    <!-- TABLE -->
    <BaseTable :data="filteredData" :columns="columns" max-height="calc(100vh - 350px)">
      <!-- NO -->
      <template #no-cell="{ row }">
        <span class="text-xs">
          {{ row.index + 1 }}
        </span>
      </template>

      <!-- KODE -->
      <template #kode_podkiesjatim-cell="{ row }">
        <span class="text-xs font-semibold">
          {{ (row.original as Feed).kode_podkiesjatim }}
        </span>
      </template>

      <!-- LINK EMBED -->
      <template #link_embed-cell="{ row }">
        <div
          class="group relative flex items-center justify-between gap-4 min-w-[380px] rounded-3xl border border-red-100 dark:border-slate-700 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.18)] transition-all duration-300 overflow-hidden"
        >
          <!-- GLOW -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-red-500/5 via-orange-400/5 to-yellow-400/5"
          ></div>

          <!-- LEFT -->
          <div class="relative flex items-center gap-4 overflow-hidden">
            <!-- THUMBNAIL -->
            <div class="relative shrink-0">
              <img
                :src="getYoutubeThumbnail((row.original as Feed).link_embed)"
                class="w-24 h-16 object-cover rounded-xl shadow-md"
              />

              <!-- PLAY ICON -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg"
                >
                  <UIcon name="i-heroicons-play-solid" class="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <!-- TEXT -->
            <div class="overflow-hidden">
              <!-- TITLE -->
              <div class="flex items-center gap-1.5 mb-1">
                <p class="text-sm font-semibold text-slate-800 dark:text-white truncate">
                  YouTube Video
                </p>

                <UIcon
                  name="i-simple-icons-youtube"
                  class="w-4 h-4 text-red-500 shrink-0"
                />
              </div>

              <!-- URL -->
              <p
                class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]"
              >
                {{ (row.original as Feed).link_embed }}
              </p>

              <!-- STATUS -->
              <div class="flex items-center gap-1.5 mt-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>

                <p class="text-[10px] text-emerald-600 font-medium">Ready to Watch</p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <a
            :href="(row.original as Feed).link_embed"
            target="_blank"
            class="relative shrink-0 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-[1.03] active:scale-[0.97]"
          >
            <UIcon name="i-heroicons-play" class="w-4 h-4" />

            Tonton
          </a>
        </div>
      </template>

      <!-- STATUS -->
      <template #status-cell="{ row }">
        <span
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-full',
            (row.original as Feed).status === 'aktif'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700',
          ]"
        >
          {{
            (row.original as Feed).status === "aktif"
              ? "Aktif"
              : "Tidak Aktif"
          }}
        </span>
      </template>

      <!-- AKSI -->
      <template #actions-cell="{ row }">
        <div class="flex gap-2">
          <!-- EDIT -->
          <button
            @click="openEdit(row.index)"
            class="p-2 bg-amber-400 text-white rounded-lg"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </button>

          <!-- DELETE -->
          <button
            @click="deleteFeed(row.index)"
            class="p-2 bg-rose-500 text-white rounded-lg"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- MODAL -->
    <BaseModalTransaksiPodkiesJatim
      size="lg"
      :model-value="showModal"
      @update:modelValue="showModal = $event"
      :is-edit="isEdit"
      :initialData="selectedData"
      :next-number="nextNumber"
      @save="handleSave"
    />
  </div>
</template>
