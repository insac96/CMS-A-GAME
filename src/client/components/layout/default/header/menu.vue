<template>
  <UiFlex class="gap-6" justify="center">
    <div v-for="(menu, index) in navItems" :key="index">
      <UButton :label="menu.label" :to="menu.to" :padded="false" color="white" variant="link" />
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const emit = defineEmits(['to'])

const show = ref(configStore.config.menu)

const navItems = computed(() => {
  const list =  []

  // Action
  if(!!show.value.action.payment){
    list.push({ label: 'Nạp xu', to: '/main/action/payment' })
  }

  if(!!show.value.action.giftcode){
    list.push({ label: 'Giftcode', to: '/main/action/giftcode'})
  }

  // Shop
  if(!!show.value.shop.pack || !!show.value.shop.item || !!show.value.shop.recharge){
    list.push({ label: 'Cửa Hàng', to: '/main/shop'})
  }

  // Event
  if(!!show.value.event.referral || !!show.value.event.login || !!show.value.event.pay || !!show.value.event.spend || !!show.value.event.paymusty || !!show.value.event.paydays){
    list.push({ label: 'Sự Kiện', to: '/main/event'})
  }

  // Mini Game
  if(!!show.value.minigame.wheel || !!show.value.minigame.dice){
    list.push({ label: 'Mini Game', to: '/main/minigame'})
  }

  // Rank
  if(!!show.value.rank.level || !!show.value.rank.power){
    list.push({ label: 'Xếp Hạng', to: '/main/rank'})
  }

  return list
})
</script>