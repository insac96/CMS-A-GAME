<template>
  <div>
    <UiFlex class="mb-4">
      <UAvatar class="sm:mr-4 mr-4 sm:w-12 sm:h-12 w-10 h-10" v-if="!!icon">
        <UiIcon :name="icon" class="sm:w-7 sm:h-7 w-5 h-5"></UiIcon>
      </UAvatar>

      <UiFlex type="col" justify="center" :items="!!start ? 'start' : 'center'" >
        <UiText class="font-bold tracking-tight md:text-2xl sm:text-xl text-lg" color="primary">{{ title }}</UiText>
        <UiText color="gray" class="tracking-tight md:text-lg sm:text-md text-sm">{{ sub }}</UiText>
      </UiFlex>

      <slot name="more"></slot>
    </UiFlex>

    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  sub: String,
  icon: String,
  start: { type: Boolean, default: true },
})

const slots = defineSlots()
</script>