<template>
  <UiFlex type="col" justify="center" class="p-6 w-full min-h-screen">
    <NuxtPage />
  </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: false
})

useSeoMeta({
  robots: 'none'
})
</script>