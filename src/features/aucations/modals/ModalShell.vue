<script setup>
import { ref, onMounted } from 'vue'

defineProps({ title: { type: String, required: true } })
const emit = defineEmits(['close'])
const panel = ref(null)
onMounted(() => panel.value.focus())
</script>

<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" @click.self="emit('close')">
    <div ref="panel" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1"
      class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" @keydown.esc="emit('close')">
      <div class="mb-4 flex items-center">
        <h2 class="mr-auto text-lg font-extrabold text-brand">{{ title }}</h2>
        <button type="button" aria-label="Tutup" class="min-h-11 min-w-11 text-lg" @click="emit('close')">&times;</button>
      </div>
      <slot />
    </div>
  </div>
</template>
