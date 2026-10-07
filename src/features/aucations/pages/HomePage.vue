<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAucationsStore } from '../states/aucationsStore.js'
import AddModal from '../modals/AddModal.vue'
import { formatRupiah } from '../../../helpers/toolsHelper.js'

const store = useAucationsStore()
const tabs = [
  { id: 'all', label: 'Semua', filters: {} },
  { id: 'mine', label: 'Lelang saya', filters: { is_me: true } },
  { id: 'open', label: 'Berlangsung', filters: { is_closed: true } },
  { id: 'closed', label: 'Selesai', filters: { is_closed: false } },
]
const tab = ref('all')
const search = ref('')
const showAdd = ref(false)

const shown = computed(() => store.aucations.filter((a) => a.title.toLowerCase().includes(search.value.toLowerCase())))
function load(t) {
  tab.value = t.id
  return store.loadAucations(t.filters)
}
onMounted(() => load(tabs[0]))
</script>

<template>
  <section aria-label="Daftar lelang" class="space-y-6">
    <div class="flex items-center">
      <h1 class="mr-auto text-2xl font-extrabold text-brand">Lelang</h1>
      <button type="button" aria-label="Tambah lelang" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white" @click="showAdd = true">Tambah lelang</button>
    </div>
    <div role="tablist" class="flex flex-wrap gap-2">
      <button v-for="t in tabs" :key="t.id" role="tab" type="button" :aria-selected="tab === t.id" :aria-label="t.label"
        class="rounded-full border border-brand px-4 py-1 font-semibold aria-selected:bg-brand aria-selected:text-white" @click="load(t)">{{ t.label }}</button>
    </div>
    <input v-model="search" type="search" aria-label="Cari lelang" placeholder="Cari judul lelang" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="a in shown" :key="a.id">
        <article class="rounded-xl bg-white p-4 shadow">
          <h2 class="font-bold"><RouterLink :to="`/aucations/${a.id}`" class="text-brand underline">{{ a.title }}</RouterLink></h2>
          <p class="font-semibold text-accent">{{ formatRupiah(a.start_bid) }}</p>
        </article>
      </li>
    </ul>
    <AddModal v-if="showAdd" @close="showAdd = false" @saved="load(tabs[0])" />
  </section>
</template>
