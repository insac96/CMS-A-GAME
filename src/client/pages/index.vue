<template>
  <div class="HomePage">
    <DataBanner class="mb-4"/>
    <DataNewsLatest />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['home']
})
</script>