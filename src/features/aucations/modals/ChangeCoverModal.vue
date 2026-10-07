<script setup>
import ModalShell from './ModalShell.vue'
import { useAucationsStore } from '../states/aucationsStore.js'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'

const props = defineProps({ id: { type: String, required: true } })
const emit = defineEmits(['close', 'saved'])
const store = useAucationsStore()

async function submit(event) {
  const res = await store.changeCover(props.id, event.target.files[0])
  if (res.success) {
    showSuccessDialog(res.message)
    emit('saved')
    emit('close')
  } else showErrorDialog(res.message)
}
</script>

<template>
  <ModalShell title="Ubah sampul" @close="emit('close')">
    <label for="cover-file" class="mb-2 block text-sm font-semibold">Pilih gambar sampul</label>
    <input id="cover-file" type="file" accept="image/*" aria-label="File sampul" @change="submit" />
  </ModalShell>
</template>
