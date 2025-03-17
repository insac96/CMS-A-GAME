<template>
  <UiContent title="Event" sub="Danh sách các sự kiện" icon="bxs-calendar">
    <UiFlex wrap class="gap-1 mb-4" justify="center">
      <UButton 
        v-for="(item, index) in items" 
        :key="index"
        :label="item.label"
        :color="tab == index ? 'primary' : 'gray'"
        @click="tab = index"
      />
    </UiFlex>
    
    <MainEventReferral v-if="select === 'referral'" />
    <MainEventLogin v-if="select === 'login'" />
    <MainEventPay v-if="select === 'pay'" />
    <MainEventSpend v-if="select === 'spend'" />
    <MainEventPaymusty v-if="select === 'paymusty'" />
    <MainEventPaydays v-if="select === 'paydays'" />
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Sự Kiện - ${configStore.config.name}`,
})

const tab = ref(0)
const show = ref(configStore.config.menu.event)
const items = computed(() => {
  const list =  []

  if(!!show.value.referral){
    list.push({ label: 'Mời Bạn', type: 'referral' })
  }
  if(!!show.value.login){
    list.push({ label: 'Đăng Nhập', type: 'login' })
  }
  if(!!show.value.pay){
    list.push({ label: 'Tích Nạp', type: 'pay' })
  }
  if(!!show.value.spend){
    list.push({ label: 'Tiêu Xu', type: 'spend' })
  }
  if(!!show.value.paymusty){
    list.push({ label: 'Nạp Đơn', type: 'paymusty' })
  }
  if(!!show.value.paydays){
    list.push({ label: 'Liên Nạp', type: 'paydays' })
  }

  return list
})
const select = computed(() => items.value[tab.value].type)
</script>