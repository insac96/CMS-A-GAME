<template>
  <CallbackSignSocial :type="social" />
</template>

<script setup>
useSeoMeta({
  title: () => `Đang xác thực...`,
})

const route = useRoute()
const social = route.params._social
</script>