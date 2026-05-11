<script setup lang="ts">
import { reactive, watch, computed } from "vue";

import BaseInput from "~/components/form/BaseInput.vue";

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  initialData?: {
    kode_podkiesjatim: string;
    link_embed: string;
    status: string;
  };
  nextNumber?: number;
}>();

const emit = defineEmits(["update:modelValue", "save"]);

/* =====================
   MODAL SIZE
===================== */
const modalSize = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-sm";

    case "lg":
      return "max-w-3xl w-full max-h-[90vh]";

    case "xl":
      return "max-w-5xl w-full max-h-[90vh]";

    default:
      return "max-w-2xl w-full max-h-[90vh]";
  }
});

/* =====================
   FORM
===================== */
const form = reactive({
  kode_podkiesjatim: "",
  link_embed: "",
  status: "aktif",
});

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

  form.kode_podkiesjatim = `POD${tanggal}${urutan}`;
}

/* =====================
   CLEAN URL
===================== */
const cleanYoutubeUrl = computed(() => {
  if (!form.link_embed) return "";

  return form.link_embed.trim();
});

/* =====================
   GET VIDEO ID
===================== */
const youtubeVideoId = computed(() => {
  if (!form.link_embed) return "";

  const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/;

  const match = form.link_embed.match(regExp);

  return match ? match[1] : "";
});

/* =====================
   EMBED URL
===================== */
const youtubeEmbedUrl = computed(() => {
  if (!youtubeVideoId.value) return "";

  return `https://www.youtube.com/embed/${youtubeVideoId.value}`;
});

/* =====================
   THUMBNAIL
===================== */
const youtubeThumbnail = computed(() => {
  if (!youtubeVideoId.value) return "";

  return `https://img.youtube.com/vi/${youtubeVideoId.value}/hqdefault.jpg`;
});

/* =====================
   WATCH MODAL
===================== */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;

    if (props.isEdit && props.initialData) {
      form.kode_podkiesjatim = props.initialData.kode_podkiesjatim;

      form.link_embed = props.initialData.link_embed;

      form.status = props.initialData.status;
    } else {
      generateKode();

      form.link_embed = "";

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
          'relative z-10 flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden',
          modalSize,
        ]"
      >
        <!-- HEADER -->
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800"
        >
          <div class="flex items-center gap-4">
            <!-- ICON -->
            <div
              class="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"
            >
              <UIcon
                :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-plus'"
                class="w-5 h-5"
              />
            </div>

            <!-- TITLE -->
            <div>
              <h2 class="text-base font-semibold text-slate-800 dark:text-white">
                {{ isEdit ? "Edit Podkies Jatim" : "Tambah Podkies Jatim" }}
              </h2>

              <p class="text-xs text-slate-500">
                {{ isEdit ? "Perbarui podkies jatim" : "Tambahkan podkies jatim baru" }}
              </p>
            </div>
          </div>

          <!-- CLOSE -->
          <button
            @click="close"
            class="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <!-- BODY -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-6 space-y-6">
          <!-- KODE -->
          <div v-if="isEdit">
            <label
              class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block"
            >
              Kode Podkies Jatim
            </label>

            <BaseInput v-model="form.kode_podkiesjatim" disabled />
          </div>

          <!-- LINK -->
          <div>
            <label
              class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block"
            >
              Link YouTube
            </label>

            <BaseInput
              v-model="form.link_embed"
              placeholder="https://youtube.com/watch?v=xxxxx"
            />

            <p class="text-xs text-slate-400 mt-2">Paste link youtube video / shorts</p>
          </div>

          <!-- PREVIEW -->
          <Transition name="preview-fade">
            <div v-if="youtubeEmbedUrl" class="flex justify-center">
              <div
                class="w-full rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
              >
                <!-- HEADER -->
                <div
                  class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700"
                >
                  <!-- LEFT -->
                  <div class="flex items-center gap-3">
                    <!-- ICON -->
                    <div
                      class="w-11 h-11 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-md"
                    >
                      <UIcon name="i-simple-icons-youtube" class="w-5 h-5 text-white" />
                    </div>

                    <!-- TEXT -->
                    <div>
                      <h3 class="text-sm font-semibold text-slate-800 dark:text-white">
                        YouTube Preview
                      </h3>

                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        Auto Embed Preview
                      </p>
                    </div>
                  </div>

                  <!-- OPEN -->
                  <a
                    :href="cleanYoutubeUrl"
                    target="_blank"
                    class="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
                  >
                    Open
                  </a>
                </div>

                <!-- THUMBNAIL -->

                <!-- EMBED -->
                <div
                  class="p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
                >
                  <div
                    class="rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-700 aspect-video"
                  >
                    <iframe
                      :src="youtubeEmbedUrl"
                      class="w-full h-full"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- STATUS -->
          <div v-if="isEdit">
            <label
              class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block"
            >
              Status
            </label>

            <USelectMenu
              v-model="form.status"
              :items="statusOptions"
              value-key="value"
              label-key="label"
              placeholder="Pilih status"
              class="w-full px-3 py-3 rounded-xl text-sm bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700"
            />
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
        >
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Tutup
          </button>

          <button
            @click="submit"
            class="px-5 py-2 text-sm font-medium bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-sm"
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
  transform: translateY(-10px) scale(0.98);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: all 0.3s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
