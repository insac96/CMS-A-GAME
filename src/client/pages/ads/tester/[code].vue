<template>
  <div class="w-full h-full fixed top-0 left-0" v-if="!!tester">
    <iframe 
      title="Tester Page"
      :src="tester.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'ads',
})

const route = useRoute()
const tester = ref(undefined)

const getTester = async () => {
  try {
    const data = await useAPI('ads/tester/code', { code: route.params.code })
    tester.value = data
  }
  catch (e) {
    return false
  }
}
getTester()
</script>