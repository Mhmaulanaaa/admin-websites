<script setup lang="ts">
const props = defineProps<{
  file: File | string | null;
}>();
import { ref, watch, computed } from "vue";

const emit = defineEmits(["update:file"]);

const inputRef = ref<HTMLInputElement | null>(null);
const internalFile = ref<File | null>(null);

// 🔥 DETECT TYPE
const isUrl = computed(() => typeof props.file === "string");
const fileName = computed(() => {
  if (internalFile.value) return internalFile.value.name;
  if (typeof props.file === "string") {
    return props.file.split("/").pop(); // ambil nama file dari URL
  }
  return "";
});

const fileType = computed(() => {
  if (internalFile.value) return internalFile.value.type;

  if (typeof props.file === "string") {
    if (!props.file.includes(".")) return "";

    const ext = props.file.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
      case "png":
        return "image/*";
      case "zip":
        return "application/zip";
      default:
        return "";
    }
  }

  return "";
});

watch(
  () => props.file,
  (val) => {
    if (val instanceof File) {
      internalFile.value = val;
    } else {
      internalFile.value = null;
    }
  },
  { immediate: true }
);

function openFile() {
  inputRef.value?.click();
}

function handleFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const selected = target.files?.[0];
  if (!selected) return;

  internalFile.value = selected;
  emit("update:file", selected);
}

function removeFile() {
  internalFile.value = null;
  emit("update:file", null);
}

// 🔥 Tentukan icon berdasarkan tipe file
function getFileIcon(file: any) {
  if (!file) return "i-heroicons-document";

  // 🔥 FIX: handle File object
  if (file instanceof File) {
    const type = file.type;

    if (type.includes("pdf")) return "i-heroicons-document-text";
    if (type.includes("image")) return "i-heroicons-photo";

    return "i-heroicons-document";
  }

  // 🔥 handle string
  if (typeof file === "string") {
    const ext = file.includes(".") ? file.split(".").pop()?.toLowerCase() : "";

    if (ext === "pdf") return "i-heroicons-document-text";
    if (["jpg", "jpeg", "png"].includes(ext || "")) return "i-heroicons-photo";
  }

  return "i-heroicons-document";
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 transition"
  >
    <input type="file" class="hidden" @change="handleFile" ref="inputRef" />

    <!-- EMPTY -->
    <div v-if="!props.file || props.file === ''" @click="openFile">
      <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 mx-auto text-emerald-500" />
      <p class="text-sm text-gray-500">Upload file</p>
    </div>

    <!-- FILE EXIST (CREATE / EDIT) -->
    <div v-else class="flex flex-col items-center gap-2">
      <UIcon :name="getFileIcon(fileType)" class="w-8 h-8 text-gray-600" />

      <p class="text-xs text-gray-600 break-all">
        {{ fileName }}
      </p>

      <div class="flex gap-2 mt-2">
        <button @click="openFile" class="px-3 py-1 text-xs bg-gray-200 rounded-md">
          Ganti
        </button>

        <button
          @click="removeFile"
          class="px-3 py-1 text-xs bg-red-500 text-white rounded-md"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>
