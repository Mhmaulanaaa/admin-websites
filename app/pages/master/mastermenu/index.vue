<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { toastSuccess, toastError, toastWarning } from "~/utils/toast";
import { confirmAction, successAlert, errorAlert } from "~/utils/swal";
import BaseStatCard from "~/components/form/BaseStatCard.vue";
import BaseSearch from "~/components/form/BaseSearch.vue";
import BaseTable from "~/components/form/BaseTable.vue";
import BaseModalMenu from "~/components/base/master/BaseModalMenu.vue";

useHead({
  title: "Admin Master Menu",
});
definePageMeta({
  breadcrumb: [{ label: "Master", to: "/master" }, { label: "Master Menu" }],
});

/* =====================
   STATE
===================== */
const showModal = ref(false);
const isEdit = ref(false);
const editIndex = ref<number | null>(null);

const dataTable = ref([
  { name: "Website", pathurl: "/", kategori: "Website", status: "aktif" },
  { name: "Admin", pathurl: "/", kategori: "Admin", status: "tidak_aktif" },
]);

/* =====================
   MODAL CONTROL
===================== */

const selectedData = ref<any>(null);

function openCreate() {
  selectedData.value = null;
  isEdit.value = false;
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
    toastSuccess("Data sukses diubah");
  } else {
    dataTable.value.push(data);
    toastSuccess("Data sukses ditambah");
  }
}

/* =====================
   DELETE
===================== */
async function deleteUser(index: number) {
  const result = await confirmAction("Apakah Anda yakin ingin menghapus data ini?");

  if (!result.isConfirmed) return;

  dataTable.value.splice(index, 1);
  toastSuccess("Data sukses dihapus");
}

/* =====================
   SELECT2
===================== */
const kategoriOptions = [
  { value: "Website", label: "Website" },
  { value: "Admin", label: "Admin" },
];

const filterStatusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
];


/* =====================
   SEARCH
===================== */
const cariData = ref("");
const kategoriFilter = ref<{ label: string; value: string } | undefined>(undefined);
const statusFilter = ref<{ label: string; value: string } | undefined>(undefined);
const appliedFilter = ref({
  search: "",
  kategori: undefined as string | undefined,
  status: undefined as string | undefined,
});

function handleSearch() {
  appliedFilter.value = {
    search: cariData.value,
    kategori: kategoriFilter.value?.value,
    status: statusFilter.value?.value,
  };
}

function handleReset() {
  cariData.value = "";
  kategoriFilter.value = undefined;
  statusFilter.value = undefined;

  appliedFilter.value = {
    search: "",
    kategori: undefined,
    status: undefined,
  };
}

const filteredData = computed(() => {
  return dataTable.value.filter((item) => {
    const matchSearch =
      !appliedFilter.value.search ||
      [item.name, item.pathurl]
        .join(" ")
        .toLowerCase()
        .includes(appliedFilter.value.search.toLowerCase());

    const matchKategori =
      !appliedFilter.value.kategori || item.kategori === appliedFilter.value.kategori;

    const matchStatus =
      !appliedFilter.value.status || item.status === appliedFilter.value.status;

    return matchSearch && matchKategori && matchStatus;
  });
});

/* =====================
   STATISTIK
===================== */
const statistik = computed(() => ({
  total: dataTable.value.length,
  aktif: dataTable.value.filter((i) => i.status === "aktif").length,
  tidak: dataTable.value.filter((i) => i.status === "tidak_aktif").length,
}));

// Interface untuk tipe data menu
interface Menu {
  name: string;
  pathurl: string;
  kategori: string;
  status: string;
}
// TABLE
const columns = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "nama_menu", header: "Nama Menu" },
  { accessorKey: "pathurl", header: "Path URL" },
  { accessorKey: "kategori", header: "Kategori" },
  { accessorKey: "status", header: "Status Aktivasi" },
  { accessorKey: "actions", header: "Aksi" },
];
</script>
<template>
  <!-- Start Section -->
  <div class="mb-4">
    <h1 class="text-xl font-semibold text-gray-800 dark:text-white mb-1">
      Master Submenu
    </h1>
    <AppBreadcrumb />
  </div>
  <div class="grid grid-cols-3 gap-4 mb-6">
    <BaseStatCard
      title="Total Menu"
      :value="statistik.total"
      color="from-blue-500 to-blue-600"
      iconColor="text-blue-200"
      textColor="text-blue-100"
    />

    <BaseStatCard
      title="Total Menu Aktif"
      :value="statistik.aktif"
      color="from-green-500 to-green-600"
      iconColor="text-white-200"
      textColor="text-white-100"
    />

    <BaseStatCard
      title="Total Menu Tidak Aktif"
      :value="statistik.tidak"
      color="from-red-500 to-red-600"
      iconColor="text-white-200"
      textColor="text-white-100"
    />
  </div>
  <!-- End Start Section -->
  <!-- TOP ACTION SEARCH -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-5"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <!-- SEARCH -->
      <div class="w-full group flex items-center sm:w-full group gap-5">
        <div class="flex-1">
          <BaseSearch v-model="cariData" placeholder="Cari Menu... " />
        </div>
        <div class="flex-1">
          <USelectMenu
            label="Pilih Kategori"
            placeholder="Pilih Kategori"
            v-model="kategoriFilter"
            :items="kategoriOptions"
            class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
        </div>
        <div class="flex-1">
          <USelectMenu
            label="Pilih Status Aktivasi"
            placeholder="Pilih Status Aktivasi"
            v-model="statusFilter"
            :items="filterStatusOptions"
            class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
          />
        </div>
      </div>
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
    <!-- END SEARCH -->
  </div>
  <!-- END TOP ACTION SEARCH -->
  <!-- BASE TABLE + MODAL -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
  >
    <!-- Add BUTTON -->
    <div class="flex justify-end mb-4">
      <button
        @click="openCreate"
        class="bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
      >
        <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 text-white" />
        Tambah
      </button>
    </div>
    <!-- TABLE -->
    <BaseTable
      ref="tableRef"
      :data="filteredData"
      :columns="columns"
      max-height="calc(100vh - 350px)"
    >
      <!-- NO -->
      <template #no-cell="{ row }">
        <span class="text-xs text-center">
          {{ row.index + 1 }}
        </span>
      </template>

      <!-- NAMA MENU -->
      <template #nama_menu-cell="{ row }">
        <span class="text-xs font-medium text-gray-700 dark:text-slate-200">
          {{ (row.original as Menu).name }}
        </span>
      </template>

      <!-- PATH URL -->
      <template #pathurl-cell="{ row }">
        <span class="text-xs">
          {{ (row.original as Menu).pathurl }}
        </span>
      </template>

      <!-- KATEGORI -->
      <template #kategori-cell="{ row }">
        <span
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-full',
            (row.original as Menu).kategori === 'Website'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30',
          ]"
        >
          {{ (row.original as Menu).kategori }}
        </span>
      </template>

      <!-- STATUS -->
      <template #status-cell="{ row }">
        <span
          :class="[
            'px-2.5 py-1 text-xs font-medium rounded-full',
            (row.original as Menu).status === 'aktif'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30',
          ]"
        >
          {{ (row.original as Menu).status === "aktif" ? "Aktif" : "Tidak Aktif" }}
        </span>
      </template>

      <!-- AKSI -->
      <template #actions-cell="{ row }">
        <div class="gap-2 flex text-center" @click.stop>
          <button
            @click="openEdit(row.index)"
            class="p-2 bg-amber-400 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-500 transition"
          >
            <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </button>

          <!-- DELETE -->
          <button
            @click="deleteUser(row.index)"
            class="p-2 bg-rose-500 dark:bg-rose-600 text-white rounded-lg hover:bg-rose-600 transition"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </BaseTable>
    <!-- End Table -->
    <div>
      <BaseModalMenu
        size="lg"
        :model-value="showModal"
        @update:modelValue="showModal = $event"
        :is-edit="isEdit"
        :initialData="selectedData"
        @save="handleSave"
      />
    </div>
  </div>
  <!-- END BASE TABLE + MODAL -->
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
