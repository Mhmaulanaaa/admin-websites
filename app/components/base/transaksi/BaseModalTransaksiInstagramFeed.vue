<script setup lang="ts">
import { reactive, watch, computed, ref, nextTick, onMounted } from "vue";

import BaseInput from "~/components/form/BaseInput.vue";

declare global {
  interface Window {
    instgrm: any;
  }
}

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  initialData?: {
    kode_instagramfeed: string;
    link_embed: string;
    status: string;
  };
  nextNumber?: number;
}>();

const emit = defineEmits(["update:modelValue", "save"]);

/* =====================
   LOAD INSTAGRAM SCRIPT
===================== */
onMounted(() => {
  if (!document.getElementById("instagram-embed-script")) {
    const script = document.createElement("script");

    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;

    document.body.appendChild(script);
  }
});

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
  kode_instagramfeed: "",
  link_embed: "",
  status: "aktif",
});

const loadingPreview = ref(false);

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
   CLEAN URL
===================== */
const cleanInstagramUrl = computed(() => {
  if (!form.link_embed) return "";

  return form.link_embed
    .replace("?utm_source=ig_web_copy_link", "")
    .replace("&igsh=", "")
    .replace(/\/$/, "");
});

/* =====================
   PROCESS EMBED
===================== */
async function processInstagramEmbed() {
  if (!form.link_embed) return;

  loadingPreview.value = true;

  await nextTick();

  setTimeout(() => {
    try {
      window.instgrm?.Embeds?.process();
    } catch (error) {
      console.error(error);
    } finally {
      loadingPreview.value = false;
    }
  }, 500);
}

/* =====================
   WATCH MODAL
===================== */
watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return;

    if (props.isEdit && props.initialData) {
      form.kode_instagramfeed = props.initialData.kode_instagramfeed;

      form.link_embed = props.initialData.link_embed;

      form.status = props.initialData.status;
    } else {
      generateKode();

      form.link_embed = "";
      form.status = "aktif";
    }

    await processInstagramEmbed();
  },
  { immediate: true }
);

/* =====================
   WATCH LINK
===================== */
watch(
  () => form.link_embed,
  async (val) => {
    if (!val) return;

    await processInstagramEmbed();
  }
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
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

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
                {{ isEdit ? "Edit Instagram Feed" : "Tambah Instagram Feed" }}
              </h2>

              <p class="text-xs text-slate-500">
                {{ isEdit ? "Perbarui instagram feed" : "Tambahkan instagram feed baru" }}
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
              Kode Feed
            </label>

            <BaseInput v-model="form.kode_instagramfeed" disabled />
          </div>

          <!-- LINK -->
          <div>
            <label
              class="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block"
            >
              Link Instagram
            </label>

            <BaseInput
              v-model="form.link_embed"
              placeholder="https://www.instagram.com/p/xxxxx/"
            />

            <p class="text-xs text-slate-400 mt-2">Paste link reels/post instagram</p>
          </div>

          <!-- LOADING -->
          <div
            v-if="loadingPreview"
            class="rounded-3xl border border-slate-200 dark:border-slate-700 p-10 flex flex-col items-center justify-center"
          >
            <div
              class="w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-5"
            ></div>

            <p class="text-sm text-slate-500">Memuat preview instagram...</p>
          </div>

          <!-- PREVIEW -->
          <Transition name="preview-fade">
            <div v-if="form.link_embed && !loadingPreview" class="flex justify-center">
              <div
                class="w-full max-w-full rounded-[20px] overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl transition-colors duration-300"
              >
                <!-- HEADER -->
                <div
                  class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <!-- LEFT -->
                  <div class="flex items-center gap-3">
                    <!-- ICON -->
                    <div
                      class="w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 flex items-center justify-center shadow-md"
                    >
                      <UIcon name="i-simple-icons-instagram" class="w-5 h-5 text-white" />
                    </div>

                    <!-- TEXT -->
                    <div>
                      <h3 class="text-sm font-semibold text-slate-800 dark:text-white">
                        Instagram Preview
                      </h3>

                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        Auto Embed Preview
                      </p>
                    </div>
                  </div>

                  <!-- OPEN -->
                  <a
                    :href="cleanInstagramUrl"
                    target="_blank"
                    class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 text-white text-xs font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
                  >
                    Open
                  </a>
                </div>

                <!-- EMBED -->
                <div
                  class="p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
                >
                  <div
                    class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <blockquote
                      class="instagram-media !mx-auto"
                      :data-instgrm-permalink="cleanInstagramUrl"
                      data-instgrm-version="14"
                      style="width: 100%; min-width: 100%; margin: auto"
                    ></blockquote>
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
