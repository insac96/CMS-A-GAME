<template>
  <div class="w-full h-full z-[99] fixed top-0 left-0">
    <iframe 
      title="Landing Page"
      :src="config.game.landing"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="navigateTo('/main')"></div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'landing',
})

const { config } = useConfigStore()
</script>