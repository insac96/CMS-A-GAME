<template>
  <div class="UiContent relative">
    <UiFlex type="col" :items="headAlign" :class="[
      'capitalize mb-4',
    ]">
      <UiFlex :justify="headAlign">
        <UiDot size="4" class="md:mr-4 mr-2" v-if="!!dot"></UiDot>
        <p class="md:text-3xl text-xl font-bold text-gray-700 dark:text-gray-300">{{ title || '...' }}</p>
      </UiFlex>
      <UiText color="gray" :align="headAlign" class="md:text-xl text-sm md:mt-1">{{ sub || '...' }}</UiText>
    </UiFlex>

    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  sub: String,
  dot: { type: Boolean, default: true },
  headAlign: { type: String, default: 'start' }
})

const slots = defineSlots()
</script>