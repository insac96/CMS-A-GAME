<template>
  <UButton :block="block" icon="i-bx-play" :size="size || 'md'" :loading="loading" @click="start">{{ text || 'Chơi Ngay' }}</UButton>
</template>

<script setup>
const props = defineProps(['block', 'text', 'size'])
const loading = ref(false)
const authStore = useAuthStore()
const gameStore = useGameStore()

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    loading.value = true
    const url = await useAPI('game/start')
    
    gameStore.setURL(url)
    navigateTo('/play')
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>