<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <!-- 🔥 SLOT CUSTOM -->
    <slot />
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});
defineEmits(["update:modelValue"]);
</script>
