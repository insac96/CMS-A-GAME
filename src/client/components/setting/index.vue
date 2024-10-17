<template>
  <UiFlex>
    <UButton 
      icon="i-bxs-brush"
      color="gray"
      aria-label="Theme"
      @click="open = true"
    />

    <UModal v-model="open" :ui="{width: 'sm:max-w-[250px]'}">
      <UiFlex type="col" class="p-4">
        <SettingMode class="mb-2"/>
        <SettingColor />
      </UiFlex>
    </UModal>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>