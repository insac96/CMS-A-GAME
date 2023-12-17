<template>

  <div id="ButtonDrag" class="dark:bg-primary-500 bg-primary-400 shadow-xl rounded-full" :style="style" ref="el" >
    <UiIcon name="i-bx-menu" size="6" @click="openMenu"/>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const emits = defineEmits(['open', 'startdrag', 'enddrag'])

const el = ref(null)

const dragging = ref(false)

const { style } = useDraggable(el, {
  initialValue: { x: -10, y: -10 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
    emits('startdrag')
  },
  onEnd: () => {
    dragging.value = false
    emits('enddrag')
  }
})

const openMenu = () => {
  emits('open')
}
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  width: 45px
  height: 45px
  z-index: 100
  cursor: pointer
</style>