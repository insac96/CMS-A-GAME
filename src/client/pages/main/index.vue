<template>
  <UButton @click="test">Test</UButton>

  <div class="HomePage">
    <DataBanner class="mb-7" />
    <DataNewsLatest />
  </div>
</template>

<script setup>
const test = async () => {
  const formData = new FormData();
  formData.append("username", "Groucho");
  formData.append("accountnum", 123456);
  await useAPI('callback/bank', formData)
}
</script>