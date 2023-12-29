<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="2" />
    <NuxtPage />
    <UNotifications />
    <SocketNoticeReload />
    <SocketNoticeSystem />
    <LazyAuthUpdateUsername v-if="authStore.isLogin && !authStore.profile.username" />
  </NuxtLayout>
</template>

<script setup>
import colors from '#tailwind-config/theme/colors'
const { $socket } = useNuxtApp()
const { imgLink } = useMakeLink()

const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
const route = useRoute()

const configStore = useConfigStore()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)

// Meta Seo
useSeoMeta({
  title: () => configStore.config.name,
  ogTitle: () => configStore.config.name,
  description: () => configStore.config.description,
  ogDescription: () => configStore.config.description,
  ogImage: () => imgLink(configStore.config.og_image),
  ogImageAlt: () => configStore.config.name,
  themeColor: () => colors[appConfig.ui.gray][900],
  ogType: 'website'
})

useHead({
  meta: [
    { name: 'google-site-verification', content: configStore.config.google.client_verify },
    { name: 'zalo-platform-site-verification', content: configStore.config.zalo.client_verify },
  ]
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
});

// Add Cookie Ads From
const fromCookie = useCookie('ads-from', runtimeConfig.public.cookieConfig)
if(route.query.f) fromCookie.value = route.query.f

// Set Theme
if(primaryCookie.value){
  appConfig.ui.primary = primaryCookie.value
}
if(grayCookie.value){
  appConfig.ui.gray = grayCookie.value
}

// Init Socket
onMounted(() => {
  $socket.emit('join-online', !!authStore.isLogin ? authStore.profile._id : null)
  $socket.on('online', data => socketStore.setOnline(data))
  $socket.on('update-online', () => $socket.emit('update-online'))
})
</script>