<script setup lang="ts">
import { reactive, watch, computed } from "vue";
import BaseInput from "~/components/form/BaseInput.vue";
import BaseDatePicker from "~/components/form/BaseDatePicker.vue";
import BaseTextArea from "~/components/form/BaseTextArea.vue";
import BaseDropZone from "~/components/form/BaseDropZone.vue";

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  initialData?: {
    kode_instagramfeed: string;
    judul_feed: string;
    caption: string;
    kategori: string;
    tanggal_posting: string;
    file?: string;
    status: string;
  };
  nextNumber?: number;
}>();

const emit = defineEmits(["update:modelValue", "save"]);

const modalSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";
    case "lg":
      return "max-w-2xl w-full max-h-[90vh]";

    case "xl":
      return "max-w-4xl w-full max-h-[90vh]";
    default:
      return "max-w-md";
  }
});

/* =====================
   FORM
===================== */
const form = reactive({
  kode_instagramfeed: "",
  judul_feed: "",
  caption: "",
  kategori: "",
  tanggal_posting: "",
  file: "" as string,
  status: "aktif",
});

function handleUpload(file: File | null) {
  if (!file) {
    form.file = "";
    return;
  }

  // sementara (frontend only)
  form.file = URL.createObjectURL(file);
}

/* =====================
   GENERATE KODE
===================== */
function generateKode() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const tanggal = `${year}${month}${day}`;
  const urutan = String(props.nextNumber ?? 1).padStart(3, "0");

  form.kode_instagramfeed = `IGF${tanggal}${urutan}`;
}

/* =====================
   WATCH MODAL
===================== */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;

    if (props.isEdit && props.initialData) {
      const data = props.initialData;

      form.kode_instagramfeed = data.kode_instagramfeed;
      form.judul_feed = data.judul_feed;
      form.caption = data.caption;
      form.kategori = data.kategori;
      form.tanggal_posting = data.tanggal_posting;
      form.file = data.file ?? "";
      form.status = data.status;
    } else {
      generateKode();

      form.judul_feed = "";
      form.caption = "";
      form.kategori = "";
      form.tanggal_posting = "";
      form.file = "";
      form.status = "aktif";
    }
  },
  { immediate: true }
);

/* =====================
   ACTION
===================== */
function close() {
  emit("update:modelValue", false);
}

function submit() {
  emit("save", {
    ...form,
  });

  close();
}

/* =====================
   OPTIONS
===================== */
const kategoriOptions = [
  { value: "Edukasi", label: "Edukasi" },
  { value: "Informasi", label: "Informasi" },
  { value: "Promosi", label: "Promosi" },
  { value: "Event", label: "Event" },
];

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "tidak_aktif", label: "Tidak Aktif" },
];
</script>

<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- BACKDROP -->
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <!-- MODAL -->
      <div
        :class="[
          'relative z-10 flex flex-col w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl',
          modalSize,
        ]"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700"
        >
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
                {{ isEdit ? "Edit Instagram Feed" : "Tambah Instagram Feed" }}
              </h2>

              <p class="text-xs text-slate-500">
                {{
                  isEdit
                    ? "Perbarui data instagram feed"
                    : "Tambahkan instagram feed baru"
                }}
              </p>
            </div>
          </div>

          <!-- CLOSE -->
          <button
            @click="close"
            class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <!-- BODY -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-4">
          <!-- KODE -->
          <div v-if="isEdit">
            <label class="text-sm font-medium mb-1 block"> Kode Feed </label>

            <BaseInput
              v-model="form.kode_instagramfeed"
              disabled
              placeholder="Kode Feed"
            />
          </div>

          <!-- JUDUL -->
          <div>
            <label class="text-sm font-medium mb-1 block"> Judul Feed </label>

            <BaseInput v-model="form.judul_feed" placeholder="Masukkan judul feed" />
          </div>

          <!-- CAPTION -->
          <div>
            <label class="text-sm font-medium mb-1 block"> Caption Instagram </label>

            <BaseTextArea
              v-model="form.caption"
              placeholder="Masukkan caption instagram feed"
            />
          </div>

          <!-- KATEGORI -->
          <div>
            <label class="text-sm font-medium mb-1 block"> Kategori </label>

            <USelectMenu
              v-model="form.kategori"
              :items="kategoriOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih kategori"
              class="w-48 w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>

          <!-- TANGGAL -->
          <div>
            <label class="text-sm font-medium mb-1 block"> Tanggal Posting </label>

            <BaseDatePicker
              v-model="form.tanggal_posting"
              placeholder="Pilih tanggal posting"
              class="w-full"
            />
          </div>

          <!-- FILE -->
          <div>
            <label class="text-sm">File</label>
            <BaseDropZone :file="form.file" @update:file="handleUpload" />
          </div>
          <!-- STATUS -->
          <div v-if="isEdit">
            <label class="text-sm font-medium mb-1 block"> Status </label>

            <USelectMenu
              v-model="form.status"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih status"
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

.hide-scrollbar::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
