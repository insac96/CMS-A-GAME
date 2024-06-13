<template>
  <UiContent :title="config.name" :sub="config.description">
    <template #right-head>
      <UiFlex class="ml-4">
        <PlayBtn v-if="!config.game.mobile" text="Chơi" size="sm"></PlayBtn>
        <UButton icon="i-bxl-android" color="gray" class="ml-1" v-if="!!config.download.apk" @click="download(config.download.apk)"></UButton>
        <UButton icon="i-bxl-apple" color="gray" class="ml-1" v-if="!!config.download.ios" @click="download(config.download.ios)"></UButton>
      </UiFlex>
    </template>

    <UiImg 
      :src="config.og_image"
      w="16" h="9"
      img-size="xs:300px sm:600 md:800px 1000px"
      alt="Banner"
      class="transition-all rounded-3xl shadow-md hover:shadow-lg"
      preload
    ></UiImg>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)

const download = (link) => {
  window.open(link, '_blank'); 
}
</script>