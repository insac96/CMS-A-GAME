<template>
  <UiFlex type="col" justify="center" class="h-full" @click="start" v-if="authStore.isLogin">
    <UiIcon name="i-bxs-wink-smile" class="mb-4" size="24" color="primary" />
    <UiText color="primary" weight="bold" size="4xl" class="mb-4 px-2">Xin chào, {{ authStore.profile.username }}</UiText>
    <UiText class="mb-4 px-6" align="center">Chào mừng đến với {{ configStore.config.name }}, chúc bạn có những phút giây vui vẻ</UiText>
    <UiIcon color="primary" name="i-bx-loader-alt" class="animate-spin mb-1" size="5" />
    <UiText color="gray" size="sm">Đang chuyển hướng...</UiText>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: false,
  middleware: 'user'
})

useSeoMeta({
  title: () => `Thank You`,
  robots: 'none'
})

useHead({
  script: [
    { children: `fbq('track', 'ThankYou');`}
  ],
})

const start = async () => {
  try {
    if(!!configStore.config.thankyou.link){
      return window.open(configStore.config.thankyou.link)
    }

    else {
      await useAPI('game/start')
      if(!!runtimeConfig.public.dev) navigateTo('/play')
      else location.href = `http://game.${runtimeConfig.public.domain}/play`
    }
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}

const init = () => setTimeout(() => {
  if(route.query.test) return
  process.client && start()
}, 5000)

init()
</script>