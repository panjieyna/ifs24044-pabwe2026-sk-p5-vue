<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore.js'

const store = useUsersStore()
onMounted(store.loadUsers)
</script>

<template>
  <section aria-label="Daftar pengguna">
    <h1 class="text-2xl font-extrabold text-brand mb-4">Pengguna</h1>
    <ul class="grid gap-3 sm:grid-cols-2">
      <li v-for="user in store.users" :key="user.id" class="rounded-xl bg-white p-4 shadow">
        <p class="font-semibold">{{ user.name }}</p>
        <p class="text-sm text-stone-700">{{ user.email }}</p>
      </li>
    </ul>
  </section>
</template>
