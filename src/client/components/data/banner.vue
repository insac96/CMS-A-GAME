<template>
  <UiContent :title="config.name" :sub="config.description" icon="bxs-party" class="w-[800px] max-w-full mx-auto">
    <UiImg 
      :src="config.og_image"
      w="16" h="9"
      img-size="xs:300px sm:600 md:800px 1000px"
      alt="Banner"
      class="transition-all rounded-lg shadow-md hover:shadow-lg max-w-full"
      preload
    ></UiImg>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>