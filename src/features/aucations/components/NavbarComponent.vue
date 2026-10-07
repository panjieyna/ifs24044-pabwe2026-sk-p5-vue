<script setup>
const emit = defineEmits(['logout'])
</script>

<template>
  <header class="bg-brand text-white">
    <nav class="mx-auto flex max-w-6xl items-center p-4" aria-label="Navigasi utama">
      <span class="mr-auto text-lg font-extrabold">Delcom Auction</span>
      <button type="button" aria-label="Keluar" class="rounded-lg bg-white px-3 py-1 font-semibold text-brand" @click="emit('logout')">Keluar</button>
    </nav>
  </header>
</template>
