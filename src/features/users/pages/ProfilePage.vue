<script setup>
import { reactive, onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore.js'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'

const store = useUsersStore()
const form = reactive({ name: '', email: '' })
const pw = reactive({ password: '', new_password: '', new_password_confirmation: '' })
const notify = (res) => (res.success ? showSuccessDialog : showErrorDialog)(res.message)

onMounted(async () => {
  await store.loadProfile()
  if (store.profile) Object.assign(form, { name: store.profile.name, email: store.profile.email })
})
const submitProfile = async () => notify(await store.saveProfile({ name: form.name, email: form.email }))
const submitPassword = async () => notify(await store.savePassword({ ...pw }))
const submitPhoto = async (event) => notify(await store.savePhoto(event.target.files[0]))
</script>

<template>
  <section aria-label="Profil" class="max-w-xl space-y-8">
    <h1 class="text-2xl font-extrabold text-brand">Profil saya</h1>
    <form class="space-y-3" @submit.prevent="submitProfile">
      <label for="profile-name" class="block text-sm font-semibold">Nama</label>
      <input id="profile-name" v-model="form.name" aria-label="Nama" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-email" class="block text-sm font-semibold">Email</label>
      <input id="profile-email" v-model="form.email" type="email" aria-label="Email" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <button type="submit" aria-label="Simpan profil" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white">Simpan profil</button>
    </form>
    <div>
      <label for="profile-photo" class="block text-sm font-semibold">Foto profil</label>
      <input id="profile-photo" type="file" accept="image/*" aria-label="Foto profil" @change="submitPhoto" />
    </div>
    <form class="space-y-3" @submit.prevent="submitPassword">
      <label for="profile-password" class="block text-sm font-semibold">Kata sandi saat ini</label>
      <input id="profile-password" v-model="pw.password" type="password" aria-label="Kata sandi saat ini" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-new-password" class="block text-sm font-semibold">Kata sandi baru</label>
      <input id="profile-new-password" v-model="pw.new_password" type="password" aria-label="Kata sandi baru" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-confirm-password" class="block text-sm font-semibold">Konfirmasi kata sandi baru</label>
      <input id="profile-confirm-password" v-model="pw.new_password_confirmation" type="password" aria-label="Konfirmasi kata sandi baru" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <button type="submit" aria-label="Ubah kata sandi" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white">Ubah kata sandi</button>
    </form>
  </section>
</template>
