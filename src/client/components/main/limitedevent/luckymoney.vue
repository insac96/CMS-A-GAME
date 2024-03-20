
<template>
  <UContainer class="lg:pb-28 pb-16">
    <UiFlex class="LimitedEventPage__Title" type="col" justify="center">
      <img src="/images/limitedevent/title.png" />
      <UiText class="LimitedEventPage__Title__Text sm:text-3xl text-xl sm:max-w-[7rem] max-w-[6rem] md:leading-8 leading-5" weight="bold">Ngắt Hoa May Mắn</UiText>
    </UiFlex>

    <UiFlex justify="center" wrap class="md:mt-8 mt-0 mb-4">
      <div class="LimitedEventPageLuckyMoney lg:w-[8vw] lg:h-[17vw] w-[16vw] h-[33vw]" v-for="i in 5" :key="i" @click="openReceive">
      </div>
    </UiFlex>

    <UiFlex class="LimitedEventPage__Title-2 mx-auto" justify="center" v-if="!!user">
      <UiText class="mb-1">{{ `Bạn có ${user.limitedevent?.luckymoney || 0} lượt ngắt` }}</UiText>
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
          <UButton @click="submit" :loading="loading" class="mr-1">Xác nhận</UButton>
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
  if(!!user.value && user.value.limitedevent.luckymoney < 1) return useNotify().error('Bạn đã hết lượt rút')
  open.value = true
}

const submit = async () => {
  try {
    loading.value = true

    await useAPI('auth/get')
    const data = await useAPI('limitedevent/luckymoney/open', JSON.parse(JSON.stringify(state.value)))
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
    const data = await useAPI('limitedevent/luckymoney/get')
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