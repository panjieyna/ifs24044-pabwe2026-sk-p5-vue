<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore.js'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import BidModal from '../modals/BidModal.vue'
import ChangeModal from '../modals/ChangeModal.vue'
import ChangeCoverModal from '../modals/ChangeCoverModal.vue'
import { formatRupiah, formatDate, showSuccessDialog, showErrorDialog, showConfirmDialog } from '../../../helpers/toolsHelper.js'

const route = useRoute()
const router = useRouter()
const store = useAucationsStore()
const modal = ref('')
const actions = [
  { key: 'bid', label: 'Tawar' },
  { key: 'change', label: 'Ubah lelang' },
  { key: 'cover', label: 'Ubah sampul' },
]
const load = () => store.loadAucation(route.params.aucationId)
const closeModal = () => { modal.value = '' }
watch(() => route.params.aucationId, load, { immediate: true })

async function remove() {
  if (!(await showConfirmDialog('Hapus lelang ini?'))) return
  const res = await store.removeAucation(route.params.aucationId)
  if (res.success) {
    await showSuccessDialog(res.message)
    router.push('/')
  } else showErrorDialog(res.message)
}
</script>

<template>
  <article v-if="store.aucation" class="space-y-4 rounded-xl bg-white p-6 shadow">
    <img v-if="store.aucation.cover" :src="store.aucation.cover" :alt="`Sampul ${store.aucation.title}`" class="max-h-64 rounded-lg" />
    <h1 class="text-2xl font-extrabold text-brand">{{ store.aucation.title }}</h1>
    <MarkdownViewer :source="store.aucation.description" />
    <p class="font-semibold text-accent">Harga awal {{ formatRupiah(store.aucation.start_bid) }}</p>
    <p class="text-sm">Ditutup {{ formatDate(store.aucation.closed_at) }}</p>
    <ul aria-label="Daftar penawaran">
      <li v-for="b in store.aucation.bids" :key="b.id">{{ formatRupiah(b.bid) }}</li>
    </ul>
    <div class="flex flex-wrap gap-2">
      <button v-for="a in actions" :key="a.key" type="button" :aria-label="a.label"
        class="rounded-lg bg-brand px-4 py-2 font-semibold text-white" @click="modal = a.key">{{ a.label }}</button>
      <button type="button" aria-label="Hapus lelang" class="rounded-lg border border-red-800 px-4 py-2 font-semibold text-red-800" @click="remove">Hapus lelang</button>
    </div>
    <BidModal v-if="modal === 'bid'" :id="route.params.aucationId" @close="closeModal" @saved="load" />
    <ChangeModal v-if="modal === 'change'" :id="route.params.aucationId" :aucation="store.aucation" @close="closeModal" @saved="load" />
    <ChangeCoverModal v-if="modal === 'cover'" :id="route.params.aucationId" @close="closeModal" @saved="load" />
  </article>
</template>
