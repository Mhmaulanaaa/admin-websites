<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "#app";

const router = useRouter();

const breadcrumbs = computed(() => {
  return (router.currentRoute.value.meta?.breadcrumb as any[]) || [];
});
</script>

<template>
  <nav v-if="breadcrumbs.length" class="text-sm text-gray-600">
    <ol class="flex items-center gap-2">
      <li v-for="(item, i) in breadcrumbs" :key="i" class="flex gap-2">
        <NuxtLink v-if="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="font-semibold text-emerald-500">
          {{ item.label }}
        </span>
        <span v-if="i < breadcrumbs.length - 1">-</span>
      </li>
    </ol>
  </nav>
</template>
