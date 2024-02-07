<template>
  <iframe 
    title="Playing Game"
    :src="playCookie"
    width="100%"
    height="100%"
    class="Iframe"
  ></iframe>
  
  <UModal v-model="fastBuy.modal" prevent-close>
    <DataShopBuyItem :item="fastBuy.item" :server="fastBuy.server" @close="fastBuy.modal = false" @done="onDoneBy" class="p-4" />
  </UModal>
</template>

<script setup>
definePageMeta({
  layout: 'play',
  middleware: 'playclosebeta'
})

const runtimeConfig = useRuntimeConfig()
const playCookie = useCookie('play-url', runtimeConfig.public.cookieConfig)

const fastBuy = ref({
  modal: false,
  item: null,
  server: null
})

const onDoneBy = async (data) => {
  const iframe = document.querySelector("iframe")
  iframe.contentWindow.postMessage(JSON.stringify(data), "*")
}

const onFastBuy = async (e) => {
  try {
    const detail = e.data
    if(!detail) return
    if(!detail.item_id) return

    const data = await useAPI('shop/getFastbuy', detail)
    fastBuy.value.item = data.item
    fastBuy.value.server = data.server
    fastBuy.value.modal = true
  }
  catch (e) {
    return
  }
}

onMounted(() => {
  window.addEventListener('message', onFastBuy, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', onFastBuy, false)
})
</script>