<template>
  <div class="HomePage">
    <DataBanner />
    <DataNewsLatest />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})
</script>