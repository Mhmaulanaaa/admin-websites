<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import BaseInput from "~/components/form/BaseInput.vue";

const modalSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-4xl";
    default:
      return "max-w-md"; // md
  }
});

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  initialData?: {
    kode_ruangan: string;
    nama_ruangan: string;
    unit_kerja: string;
    status: string;
  };
  nextNumber?: number;
}>();

const emit = defineEmits(["update:modelValue", "save"]);

const form = reactive({
  kode_ruangan: "",
  nama_ruangan: "",
  unit_kerja: "",
  status: "aktif",
});

function generateKode() {
  //   console.log("nextNumber:", props.nextNumber);
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const tanggal = `${year}${month}${day}`;
  const urutan = String(props.nextNumber ?? 1).padStart(3, "0");

  form.kode_ruangan = `RU${tanggal}${urutan}`;
}

const namaRuanganOptions = [
  {
    value: "1",
    label: "Ruangan 1",
    unit_kerja: "Unit Kerja 1",
  },
  {
    value: "2",
    label: "Ruangan 2",
    unit_kerja: "Unit Kerja 2",
  },
  {
    value: "3",
    label: "Ruangan 3",
    unit_kerja: "Unit Kerja 3",
  },
];

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;

    if (props.isEdit && props.initialData) {
      const initialData = props.initialData;

      form.kode_ruangan = initialData.kode_ruangan;

      const selected = namaRuanganOptions.find(
        (i) => i.label === initialData.nama_ruangan
      );

      form.nama_ruangan = selected?.value || "";
      form.unit_kerja = initialData.unit_kerja;
      form.status = initialData.status;
    } else {
      generateKode();
      form.nama_ruangan = "";
      form.unit_kerja = "";
      form.status = "aktif";
    }
  },
  { immediate: true }
);

watch(
  () => form.nama_ruangan,
  (val) => {
    const selected = namaRuanganOptions.find((i) => i.value === val);

    if (selected) {
      form.unit_kerja = selected.unit_kerja;
    }
  }
);

function close() {
  emit("update:modelValue", false);
}

function submit() {
  const selected = namaRuanganOptions.find((i) => i.value === form.nama_ruangan);

  emit("save", {
    ...form,
    nama_ruangan_id: form.nama_ruangan, // ID
    nama_ruangan: selected?.label || "", // LABEL
    unit_kerja: selected?.unit_kerja || "",
  });

  close();
}

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
];
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- BACKDROP -->
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <!-- MODAL -->
      <div
        :class="[
          'relative z-10 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden',
          modalSize,
        ]"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700"
        >
          <!-- LEFT -->
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"
            >
              <UIcon
                :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-plus'"
                class="w-5 h-5"
              />
            </div>

            <div>
              <h2 class="text-sm font-semibold text-slate-800 dark:text-white">
                {{ isEdit ? "Edit Ruang Rawat Inap" : "Tambah Ruang Rawat Inap" }}
              </h2>
              <p class="text-xs text-slate-500">
                {{
                  isEdit
                    ? "Perbarui data ruang rawat inap"
                    : "Tambahkan ruang rawat inap baru"
                }}
              </p>
            </div>
          </div>

          <!-- CLOSE BUTTON -->
          <button
            @click="close"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div class="p-6 m-1 gap-2">
          <div v-if="isEdit">
            <label class="text-sm">Kode Ruangan</label>
            <BaseInput v-model="form.kode_ruangan" placeholder="Kode Ruangan" disabled />
          </div>
          <div>
            <label class="text-sm">Nama Master Ruang Rawat Inap</label>
            <USelectMenu
              v-model="form.nama_ruangan"
              :items="namaRuanganOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih Nama Master Ruang Rawat Inap"
              class="w-48 w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          <div>
            <label class="text-sm">Unit Kerja</label>
            <BaseInput v-model="form.unit_kerja" placeholder="Unit Kerja" />
          </div>
          <div v-if="isEdit">
            <label class="text-sm">Status</label>
            <USelectMenu
              v-model="form.status"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih Status"
              class="w-48 w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
        >
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Tutup
          </button>

          <button
            @click="submit"
            class="px-5 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm"
          >
            {{ isEdit ? "Update" : "Simpan" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
