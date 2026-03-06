<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <UCard class="bg-linear-to-br from-blue-500 to-blue-600 text-white border-0">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-blue-100 text-sm">Total Pengguna</p>
          <p class="text-3xl font-bold">
            {{ statistikHariIni.totalpengguna }}
          </p>
        </div>
        <UIcon name="i-heroicons-users" class="w-8 h-8 text-blue-200" />
      </div>
    </UCard>

    <UCard class="bg-linear-to-br from-amber-500 to-amber-600 text-white border-0">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-amber-100 text-sm">Total User Aktif</p>
          <p class="text-3xl font-bold">
            {{ statistikHariIni.totaluseraktif }}
          </p>
        </div>
        <UIcon name="i-heroicons-users" class="w-8 h-8 text-amber-200" />
      </div>
    </UCard>

    <UCard class="bg-linear-to-br from-green-500 to-green-600 text-white border-0">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-green-100 text-sm">Total User Tidak Aktif</p>
          <p class="text-3xl font-bold">
            {{ statistikHariIni.totalusertidakatif }}
          </p>
        </div>
        <UIcon name="i-heroicons-users" class="w-8 h-8 text-green-200" />
      </div>
    </UCard>
  </div>
  <!-- Pembedahan Section -->
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
  >
    <!-- Add Team Button -->
    <div class="flex justify-end">
      <button
        @click="showModal = true"
        class="mt-4 bg-emerald-500 dark:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah User
      </button>
    </div>

    <!-- Team Table -->
    <div
      class="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
    >
      <table class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Nama Pengguna
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Posisi
            </th>
            <th
              class="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800"
        >
          <tr
            v-for="(member, index) in paginatedUsers"
            :key="index"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
              {{ member.name }}
            </td>
            <td class="px-4 py-3 text-slate-700 dark:text-slate-300">
              {{ member.role }}
            </td>
            <td class="px-4 py-3">
              <div class="flex justify-center gap-2">
                <!-- EDIT -->
                <button
                  @click="editUser(index)"
                  class="p-2 bg-amber-400 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-500 transition"
                >
                  <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                </button>

                <!-- DELETE -->
                <button
                  @click="deleteUser(index)"
                  class="p-2 bg-rose-500 dark:bg-rose-600 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <!-- Pagination -->
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
      <!-- Info -->
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Menampilkan
        <span class="font-semibold text-slate-800 dark:text-white">
          {{ startItem }}
        </span>
        -
        <span class="font-semibold text-slate-800 dark:text-white">
          {{ endItem }}
        </span>
        dari
        <span class="font-semibold text-slate-800 dark:text-white">
          {{ totalUsers }}
        </span>
        data
      </p>

      <!-- Pagination Buttons -->
      <div class="flex items-center gap-1">
        <!-- PREV -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-lg border text-sm flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
        >
          ← Prev
        </button>

        <!-- PAGE NUMBER -->
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'w-9 h-9 rounded-lg text-sm font-medium transition',
            currentPage === page
              ? 'bg-blue-600 text-white shadow'
              : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700',
          ]"
        >
          {{ page }}
        </button>

        <!-- NEXT -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-lg border text-sm flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
      >
        <!-- CLOSE BUTTON -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- TITLE -->
        <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
          {{ isEdit ? "Edit User" : "Tambah User" }}
        </h2>

        <!-- INPUT -->
        <div class="space-y-4">
          <div>
            <label class="text-sm text-slate-600 dark:text-slate-400">
              Nama Pengguna
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama"
              class="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="text-sm text-slate-600 dark:text-slate-400"> Posisi </label>
            <input
              v-model="form.role"
              type="text"
              placeholder="Contoh: Admin"
              class="mt-1 w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <!-- ACTION -->
        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Batal
          </button>

          <button
            @click="saveUser"
            class="px-4 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            {{ isEdit ? "Update" : "Simpan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import Swal from "sweetalert2";
const showModal = ref(false);
const isEdit = ref(false);
const editIndex = ref<number | null>(null);

const form = reactive({
  name: "",
  role: "",
  dataTableuser: [
    { name: "Admin", role: "Administrator" },
    { name: "Budi", role: "Operator" },
    { name: "Sinta", role: "Manager" },
    { name: "Joko", role: "Staff" },
    { name: "Dewi", role: "Staff" },
  ],
});

/* =====================
   CREATE / UPDATE USER
===================== */

function saveUser() {
  if (!form.name || !form.role) return;

  if (isEdit.value && editIndex.value !== null) {
    form.dataTableuser[editIndex.value] = {
      name: form.name,
      role: form.role,
    };
  } else {
    form.dataTableuser.push({
      name: form.name,
      role: form.role,
    });
  }

  resetForm();
}

function resetForm() {
  form.name = "";
  form.role = "";
  showModal.value = false;
  isEdit.value = false;
  editIndex.value = null;
}

function closeModal() {
  showModal.value = false;

  form.name = "";
  form.role = "";

  isEdit.value = false;
  editIndex.value = null;
}

/* =====================
   EDIT USER
===================== */

function editUser(index: number) {
  const user = form.dataTableuser[index];

  if (!user) return;

  form.name = user.name;
  form.role = user.role;

  editIndex.value = index;
  isEdit.value = true;
  showModal.value = true;
}

/* =====================
   DELETE USER
===================== */

function deleteUser(index: number) {
  Swal.fire({
    title: "Hapus User?",
    text: "Data akan dihapus secara permanen",
    icon: "warning",
    width: 380,
    padding: "1.5rem",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#94a3b8",
    reverseButtons: true,
    customClass: {
      popup: "rounded-xl",
      title: "text-lg font-semibold",
      confirmButton: "px-4 py-2 rounded-lg text-sm",
      cancelButton: "px-4 py-2 rounded-lg text-sm",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      form.dataTableuser.splice(index, 1);

      Swal.fire({
        icon: "success",
        title: "User dihapus",
        text: "Data berhasil dihapus",
        width: 350,
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
}

/* =====================
   PAGINATION
===================== */

const currentPage = ref(1);
const perPage = 3;

const totalPages = computed(() => Math.ceil(form.dataTableuser.length / perPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return form.dataTableuser.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

const totalUsers = computed(() => form.dataTableuser.length);
const startItem = computed(() => (currentPage.value - 1) * perPage + 1);
const endItem = computed(() => Math.min(currentPage.value * perPage, totalUsers.value));

/* =====================
   STATISTIK
===================== */

const statistikHariIni = computed(() => {
  return {
    totalpengguna: form.dataTableuser.length,
    totaluseraktif: form.dataTableuser.length,
    totalusertidakatif: 0,
  };
});
</script>
