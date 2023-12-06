<template>
  <UiContent :title="config.name" :sub="config.description">
    <div class="relative"> 
      <UiImg 
        :src="config.og_image"
        w="16" h="7"
        img-size="xs:300px sm:600 md:800px 1000px"
        alt="Banner"
        class="transition-all rounded-xl shadow-md hover:shadow-lg"
        preload
      ></UiImg>

      <div class="flex items-center justify-center absolute w-full h-full top-0 left-0 md:hidden">
        <PlayBtn text="Bấm Chơi Ngay" size="md" class="bounce-anim"></PlayBtn>
      </div>
    </div>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>