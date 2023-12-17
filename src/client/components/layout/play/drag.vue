<template>
  <div id="ButtonDrag" class="dark:bg-primary-500 bg-primary-400 shadow-xl rounded-full" :style="style" ref="el" @click="emits('open')">
    <UiIcon name="i-bx-menu" size="6" />
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const emits = defineEmits(['open'])

const el = ref(null)

const { style } = useDraggable(el, {
  initialValue: { x: -10, y: -10 },
})
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  width: 45px
  height: 45px
  z-index: 10
  cursor: pointer
</style>