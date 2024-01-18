<template>
  <UiFlex :justify="justify" class="gap-2">
    <UiText color="gray" v-if="!items || items.length == 0">{{empty || 'Không có phần thưởng'}}</UiText>
    
    <UAvatarGroup size="lg" :max="max">
      <UAvatar
        v-for="(item, index) in items" :key="index"
        :src="imgLink(item.image, item.type)"
        :alt="item.name"
      />
    </UAvatarGroup>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const props = defineProps({
  items: Array,
  empty: String,
  justify: String,
  max: { type: Number, default: 5 }
})

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',
  'notify': 'notify',

  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const imgLink = (src, type) => {
  if(!!src){
    const imagePath = configStore.config.game.image
    return !imagePath ? src : `${imagePath}/${src}`
  }
  else {
    if(!!type) return `/images/icon/${typeFormat[type]}.png`
    return null
  }
}
</script>