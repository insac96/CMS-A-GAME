
<template>
  <UContainer>
    <UiFlex type="col" justify="center">
      <UiText class="LunaTitle mb-1" size="4xl" align="center">Lì Xì May Mắn</UiText>
      <UiText color="gray" align="center">Mỗi ngày đăng nhập, miễn phí 1 lần mở bao lì xì</UiText>
    </UiFlex>

    <UiFlex justify="center" wrap class="md:mt-8 mt-0 mb-4">
      <UiFlex type="col" justify="end" class="relative md:w-[250px] md:h-[250px] w-[140px] h-[140px] md:m-8 m-4 cursor-pointer" v-for="i in 3" :key="i" @click="openReceive">
        <UiImg src="/images/lunanewyear/luckymoney.png" class="jump-anim !absolute z-10 md:bottom-[80px] bottom-[45px] left-[25px] md:h-[170px] h-[80px]" />
        <UiImg src="/images/lunanewyear/table.png" class="md:w-[250px] w-[140px]" />
      </UiFlex>
    </UiFlex>

    <UiFlex justify="center" class="my-4" v-if="!!user">
      <UiFlex class="LunaTitle-2" justify="center">{{ `Bạn có ${user.lunanewyear?.luckymoney || 0} lượt mở lì xì` }}</UiFlex>
    </UiFlex>

    <UModal prevent-close v-model="open">
      <UForm :state="state" @submit="submit" class="p-4">
        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" v-if="state.server" >
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="submit" :loading="loading" class="mr-1">Mở Lì Xì</UButton>
          <UButton color="gray" :disabled="loading" @click="open = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <UModal v-model="reward" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UCard :ui="{ body: { padding: 'p-4 sm:p-4' } }" v-if="gift">
        <UiText align="center" color="primary" weight="bold" class="mb-3">Phần thưởng</UiText>

        <DataItemImage :src="gift.item_image" :type="gift.type" :size="120" class="mx-auto" />

        <UiFlex type="col" class="mt-4">
          <UiText align="center" weight="bold" color="gray" class="leading-5">{{ gift.item_name }}</UiText>
          
          <UBadge size="md" color="primary" class="mt-4 px-3 font-semibold" v-if="!!gift.amount && gift.amount > 0">
              x {{ useMoney().toMoney(gift.amount) }}
          </UBadge>
        </UiFlex>
      </UCard>
    </UModal>
  </UContainer>
</template>

<script setup>
const authStore = useAuthStore()
const open = ref(false)
const reward = ref(false)
const loading = ref(false)

const user = ref(null)

const state = ref({
  server: null,
  role: null
})

const gift = ref(undefined)

const openReceive = () => {
  if(!authStore.isLogin) return authStore.setModal(true)
  if(!!user.value && user.value.lunanewyear.luckymoney < 1) return useNotify().error('Bạn đã hết lượt mở bao lì xì')
  open.value = true
}

const submit = async () => {
  try {
    loading.value = true

    const data = await useAPI('lunanewyear/luckymoney/open', JSON.parse(JSON.stringify(state.value)))
    gift.value = data

    open.value = false
    loading.value = false

    setTimeout(() => {
      reward.value = true
    }, 200)
  }
  catch(e){
    loading.value = false
  }
}

const getLuckyMoney = async () => {
  try {
    const data = await useAPI('lunanewyear/luckymoney/get')
    user.value = data.user
  }
  catch(e){
    user.value = null
  }
}

getLuckyMoney()
watch(() => authStore.isLogin, (val) => !!val && getLuckyMoney())
watch(() => reward.value, (val) => !!val && getLuckyMoney())
</script>