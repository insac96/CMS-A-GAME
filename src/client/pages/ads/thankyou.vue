<template>
  <UiFlex type="col" justify="center" class="h-full" @click="start" v-if="authStore.isLogin">
    <UiIcon name="i-bxs-wink-smile" size="24" color="primary" />
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

definePageMeta({
  layout: false,
  middleware: 'user'
})

useSeoMeta({
  title: () => `Thank You`,
  robots: 'none'
})

useHead({
  script: [{ children: `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '402035672245098');
    fbq('track', 'PageView');
  `}],
})

const start = async () => {
  try {
    await useAPI('game/start')

    if(!!runtimeConfig.public.dev) navigateTo('/play')
    else location.href = `http://game.${runtimeConfig.public.domain}/play`
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}

const init = () => setTimeout(() => process.client && start(), 1000)
init()
</script>