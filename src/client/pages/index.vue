<template>
  <div class="HomePage">
    <DataBanner class="mb-7" />
    <DataNewsLatest />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})
</script>