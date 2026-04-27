<script setup lang="ts">
defineProps({
  title: String,
  value: Number,
  color: String, // contoh: "from-blue-500 to-blue-600"
  icon: {
    type: String,
    default: "i-heroicons-users",
  },
  iconColor: {
    type: String,
    default: "text-white-200",
  },
  textColor: {
    type: String,
    default: "text-white-100",
  },
});
</script>

<template>
  <UCard :class="`bg-linear-to-br ${color} text-white border-0`">
    <div class="flex items-center justify-between">
      <!-- TEXT -->
      <div>
        <p :class="`${textColor} text-sm`">
          {{ title }}
        </p>
        <p class="text-3xl font-bold">
          {{ value }}
        </p>
      </div>

      <!-- ICON -->
      <UIcon :name="icon" :class="`w-8 h-8 ${iconColor}`" />
    </div>
  </UCard>
</template>
