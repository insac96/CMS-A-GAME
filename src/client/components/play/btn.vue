<template>
  <UButton :block="block" icon="i-bx-play" :size="size || 'md'" :loading="loading" @click="start">{{ text || 'Chơi Ngay' }}</UButton>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const props = defineProps(['block', 'text', 'size'])
const loading = ref(false)
const authStore = useAuthStore()

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    loading.value = true
    await useAPI('game/start')

    if (window.location.protocol == "http:") {
      navigateTo('/play')
    }
    else {
      location.href = `http://service.${runtimeConfig.public.domain}/play`
    }

    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>