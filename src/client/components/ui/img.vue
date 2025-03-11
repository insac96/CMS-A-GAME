<template>
  <div 
    class="relative select-none UiImg"
    :style="`aspect-ratio: ${w} / ${h}`"
  >
    <img
      v-if="!loading"
      :src="imgLink(imgSrc)"
      class="object-cover w-full h-full select-none"
      placeholder="/images/placeholder.png"
      :alt="props.alt" 
    />

    <USkeleton 
      class="absolute top-0 left-0 rounded-none w-full h-full" 
      :style="{
        borderRadius: 'inherit'
      }"
      v-if="!!loading"
    ></USkeleton>
  </div>
</template>

<script setup>
const { imgLink } = useMakeLink()
const props = defineProps({
  src: String,
  imgSize: [ String, Number ],
  fit: { type: String, default: 'cover' },
  imgW: [ String, Number ],
  imgH: [ String, Number ],
  w: [ String, Number ],
  h: [ String, Number ],
  alt: { type: String, default: 'image' },
  preload: { type: Boolean, default: false },
})

const imgSrc = ref(undefined)
const loading = ref(true)

onMounted(() => {
  if(!props.src){
    imgSrc.value = null
  }
  else {
    const ctx = new Image
    ctx.onload = () => imgSrc.value = props.src
    ctx.onerror = () => imgSrc.value = null
    ctx.src = props.src
  }
  loading.value = false
})
</script>

<style lang="sass">
.UiImg
  overflow: hidden
  img
    border-radius: inherit
    aspect-ratio: inherit
</style>