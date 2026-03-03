<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const { $toast } = useNuxtApp()

const loading = ref(false)

const handleLogin = async (_data: { email: string, password: string }) => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false

  $toast.success('Login berhasil!', {
    description: 'Selamat datang di Optimum'
  })

  await new Promise(resolve => setTimeout(resolve, 1500))
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex">
    <LoginHero />
    <LoginForm
      v-model:loading="loading"
      @submit="handleLogin"
    />
  </div>
</template>
