<template>
  <UiContent title="Shop" sub="Cửa hàng bày bán" icon="bxs-shopping-bag">
    <UTabs v-model="tab" :items="items" class="w-full" v-if="items.length > 1" />
    
    <MainShopRecharge v-if="select === 'recharge'" />
    <MainShopItem v-if="select === 'item'" />
    <MainShopPack v-if="select === 'pack'" />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Cửa Hàng - ${configStore.config.name}`,
})

const tab = ref(0)
const show = ref(configStore.config.menu.shop)
const items = computed(() => {
  const list =  []

  if(!!show.value.recharge){
    list.push({ label: 'Gói Nạp', type: 'recharge' })
  }
  if(!!show.value.item){
    list.push({ label: 'Vật Phẩm', type: 'item' })
  }
  if(!!show.value.pack){
    list.push({ label: 'Gói Vật Phẩm', type: 'pack' })
  }

  return list
})
const select = computed(() => items.value[tab.value].type)
</script>