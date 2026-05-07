<script setup lang="ts">
import { ref, computed } from "vue";
import { toastSuccess } from "~/utils/toast";
import { confirmAction } from "~/utils/swal";

import BaseStatCard from "~/components/form/BaseStatCard.vue";
import BaseTable from "~/components/form/BaseTable.vue";
import BaseModalTransaksiInstagramFeed from "~/components/base/transaksi/BaseModalTransaksiInstagramFeed.vue";

useHead({
  title: "Admin Transaksi Instagram Feed",
});

definePageMeta({
  breadcrumb: [{ label: "Transaksi", to: "/transaksi" }, { label: "Instagram Feed" }],
});

/* =====================
   STATE
===================== */
const showModal = ref(false);
const isEdit = ref(false);
const editIndex = ref<number | null>(null);

const dataTable = ref([
  {
    kode_instagramfeed: "IGF20260507001",
    judul_feed: "Hari Hipertensi Sedunia",
    caption:
      "Yuk jaga tekanan darah tetap stabil dengan pola hidup sehat dan olahraga rutin.",
    kategori: "Edukasi",
    tanggal_posting: "2026-05-07",
    file: "https://example.com/file1.jpg",
    status: "aktif",
  },
  {
    kode_instagramfeed: "IGF20260507002",
    judul_feed: "Pelayanan Poli Jantung RSUD Dr Soetomo",
    caption: "Pelayanan poli jantung tersedia setiap Senin - Jumat pukul 08.00 WIB.",
    kategori: "Informasi",
    tanggal_posting: "2026-05-06",
    file: "https://example.com/file1.jpg",
    status: "tidak_aktif",
  },
]);

// Get Icons PDF Table
function getFileIcon(file: string) {
  if (!file) return "i-heroicons-document";

  const ext = file.includes(".") ? file.split(".").pop()?.toLowerCase() : "";

  if (ext === "pdf") return "i-heroicons-document";
  if (["jpg", "jpeg", "png"].includes(ext || "")) return "i-heroicons-photo";
  if (ext === "zip") return "i-heroicons-archive-box";

  return "i-heroicons-document";
}

function openFile(file: string) {
  if (!file) return;
  window.open(file, "_blank");
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

const kategoriOptions = [
  { value: "Edukasi", label: "Edukasi" },
  { value: "Informasi", label: "Informasi" },
  { value: "Promosi", label: "Promosi" },
  { value: "Event", label: "Event" },
];

const judulFilter = ref<string | undefined>();
const statusFilter = ref<string | undefined>();
const kategoriFilter = ref<string | undefined>();

const appliedFilter = ref({
  judul: undefined as string | undefined,
  status: undefined as string | undefined,
  kategori: undefined as string | undefined,
});

const judulOptions = computed(() =>
  dataTable.value.map((item) => ({
    label: `${item.kode_instagramfeed} - ${item.judul_feed}`,
    value: item.kode_instagramfeed,
  }))
);

function handleSearch() {
  appliedFilter.value = {
    judul: judulFilter.value,
    status: statusFilter.value,
    kategori: kategoriFilter.value,
  };
}

function handleReset() {
  judulFilter.value = undefined;
  statusFilter.value = undefined;
  kategoriFilter.value = undefined;

  appliedFilter.value = {
    judul: undefined,
    status: undefined,
    kategori: undefined,
  };
}

/* =====================
   FILTERED DATA
===================== */
const filteredData = computed(() => {
  return dataTable.value.filter((item) => {
    const matchJudul =
      !appliedFilter.value.judul || item.kode_instagramfeed === appliedFilter.value.judul;

    const matchStatus =
      !appliedFilter.value.status || item.status === appliedFilter.value.status;

    const matchKategori =
      !appliedFilter.value.kategori || item.kategori === appliedFilter.value.kategori;

    return matchJudul && matchStatus && matchKategori;
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
  kode_instagramfeed: string;
  judul_feed: string;
  caption: string;
  kategori: string;
  tanggal_posting: string;
  file: string;
  status: string;
}

/* =====================
   TABLE
===================== */
const columns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "kode_instagramfeed", header: "Kode Feed" },
  { accessorKey: "judul_feed", header: "Judul Feed" },
  { accessorKey: "kategori", header: "Kategori" },
  { accessorKey: "tanggal_posting", header: "Tanggal Posting" },
  { accessorKey: "file", header: "File" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "actions", header: "Aksi" },
];
</script>

<template>
  <!-- HEADER -->
  <div class="mb-4">
    <h1 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
      Transaksi Instagram Feed
    </h1>

    <AppBreadcrumb />
  </div>

  <!-- STATISTIK -->
  <div class="grid grid-cols-3 gap-4 mb-6">
    <BaseStatCard
      title="Total Instagram Feed"
      :value="statistik.total"
      color="from-blue-500 to-blue-600"
      iconColor="text-pink-100"
      textColor="text-pink-100"
    />

    <BaseStatCard
      title="Instagram Feed Aktif"
      :value="statistik.aktif"
      color="from-emerald-500 to-green-600"
      iconColor="text-white"
      textColor="text-white"
    />

    <BaseStatCard
      title="Instagram Feed Tidak Aktif"
      :value="statistik.tidak"
      color="from-red-500 to-rose-600"
      iconColor="text-white"
      textColor="text-white"
    />
  </div>

  <!-- FILTER -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-5"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <!-- FEED -->
      <div class="flex-1">
        <USelectMenu
          v-model="judulFilter"
          :items="judulOptions"
          value-key="value"
          label-key="label"
          label="Pilih Feed Instagram"
          placeholder="Pilih Feed Instagram"
          class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
        />
      </div>

      <!-- KATEGORI -->
      <div class="flex-1">
        <USelectMenu
          v-model="kategoriFilter"
          :items="kategoriOptions"
          value-key="value"
          label-key="label"
          label="Pilih Kategori"
          placeholder="Pilih Kategori"
          class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
        />
      </div>

      <!-- STATUS -->
      <div class="flex-1">
        <USelectMenu
          v-model="statusFilter"
          :items="filterStatusOptions"
          value-key="value"
          label-key="label"
          label="Pilih Status"
          placeholder="Pilih Status"
          class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
        />
      </div>
    </div>

    <!-- BUTTON -->
    <div class="flex items-center gap-2 mt-5">
      <button
        @click="handleSearch"
        class="bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition flex items-center gap-2 shadow-sm"
      >
        <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-white" />
        Cari
      </button>

      <button
        @click="handleReset"
        class="bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2 shadow-sm"
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
    <!-- BUTTON TAMBAH -->
    <div class="flex justify-end mb-4">
      <button
        @click="openCreate"
        class="bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
      >
        <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 text-white" />
        Tambah
      </button>
    </div>

    <!-- BASE TABLE -->
    <BaseTable :data="filteredData" :columns="columns" max-height="calc(100vh - 350px)">
      <!-- NO -->
      <template #no-cell="{ row }">
        <span class="text-xs">
          {{ row.index + 1 }}
        </span>
      </template>

      <!-- KODE -->
      <template #kode_instagramfeed-cell="{ row }">
        <span class="text-xs font-medium">
          {{ (row.original as Feed).kode_instagramfeed }}
        </span>
      </template>

      <!-- JUDUL -->
      <template #judul_feed-cell="{ row }">
        <div class="flex flex-col">
          <span class="text-xs font-semibold">
            {{ (row.original as Feed).judul_feed }}
          </span>

          <span class="text-[11px] text-gray-500 line-clamp-2">
            {{ (row.original as Feed).caption }}
          </span>
        </div>
      </template>

      <!-- KATEGORI -->
      <template #kategori-cell="{ row }">
        <span class="px-2 py-1 rounded-full text-[11px] bg-red-100 text-red-700">
          {{ (row.original as Feed).kategori }}
        </span>
      </template>

      <!-- TANGGAL -->
      <template #tanggal_posting-cell="{ row }">
        <span class="text-xs">
          {{ (row.original as Feed).tanggal_posting }}
        </span>
      </template>

      <!-- FILE -->
      <template #file-cell="{ row }">
        <div
          class="flex items-center gap-2 cursor-pointer hover:text-emerald-600"
          @click="openFile((row.original as Feed).file)"
        >
          <UIcon :name="getFileIcon((row.original as Feed).file)" class="w-4 h-4" />
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
        <div class="gap-2 flex" @click.stop>
          <!-- EDIT -->
          <button
            @click="openEdit(row.index)"
            class="p-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </button>

          <!-- DELETE -->
          <button
            @click="deleteFeed(row.index)"
            class="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>

    <!-- MODAL -->
    <BaseModalTransaksiInstagramFeed
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

<style scoped>
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.95);
}
</style>
