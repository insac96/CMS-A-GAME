
<template>
  <UContainer>
    <UiFlex type="col" justify="center" class="mb-8">
      <UiText class="LunaTitle mb-1" size="4xl" align="center">Đập Trứng May Mắn</UiText>
      <UiText color="gray" align="center">Càng lên cao, quà càng khủng</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col">
      <UiFlex v-for="(value, row) in eggUser" :key="row" class="md:gap-6 gap-2">
        <div v-for="(egg, index) in value" :key="index" class="inline">
          <UiImg src="/images/lunanewyear/egg.png" img-w="433" img-h="576" class="LunaEgg md:w-24 w-16" v-if="!egg" @click="openReceive(row, index)"/>
          
          <UiFlex justify="center" v-else>
            <UiImg src="/images/lunanewyear/egg.png" img-w="433" img-h="576" class="LunaEggOpen md:w-24 w-16"/>
            <div class="absolute">
              <DataItem class="absolute translate-y-[7px]" :item="{
                type: egg.item.type,
                image: egg.item.item_image,
                name: egg.item.item_name,
              }" :amount="egg.amount" />
            </div>
          </UiFlex>
        </div>
      </UiFlex>
    </UiFlex>

    <UModal prevent-close v-model="open">
      <UForm :state="state" @submit="submit" class="p-4">
        <UFormGroup>
          <DataUserMini no-notify no-diamond no-wheel/>
        </UFormGroup>

        <UFormGroup label="Vị trí">
          <UInput :model-value="`Hàng ${state.row} Quả ${state.index + 1}`" readonly />
        </UFormGroup>

        <UFormGroup label="Giá tiền">
          <UInput :model-value="`${useMoney().toMoney(eggConfig.price)} Xu`" readonly />
        </UFormGroup>

        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" v-if="state.server" >
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="submit" :loading="loading" class="mr-1">Đập Trứng</UButton>
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
const eggConfig = ref(undefined)
const gift = ref(undefined)

const open = ref(false)
const reward = ref(undefined)
const loading = ref(false)

const eggUser = ref({
  1: [null],
  2: [null, null],
  3: [null, null, null],
  4: [null, null, null, null],
  5: [null, null, null, null, null],
})

const state = ref({
  server: null,
  role: null,
  row: null,
  index: null
})

const openReceive = (row, index) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  state.value.row = row
  state.value.index = index
  open.value = true
}

const submit = async () => {
  try {
    loading.value = true

    const data = await useAPI('lunanewyear/egg/open', JSON.parse(JSON.stringify(state.value)))
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

const getConfig = async () => {
  try {
    const data = await useAPI('lunanewyear/egg/get')
    eggConfig.value = data.config
    if(data.user){
      eggUser.value[1][0] = data.user[1][0] || null

      eggUser.value[2][0] = data.user[2][0] || null
      eggUser.value[2][1] = data.user[2][1] || null

      eggUser.value[3][0] = data.user[3][0] || null
      eggUser.value[3][1] = data.user[3][1] || null
      eggUser.value[3][2] = data.user[3][2] || null

      eggUser.value[4][0] = data.user[4][0] || null
      eggUser.value[4][1] = data.user[4][1] || null
      eggUser.value[4][2] = data.user[4][2] || null
      eggUser.value[4][3] = data.user[4][3] || null

      eggUser.value[5][0] = data.user[5][0] || null
      eggUser.value[5][1] = data.user[5][1] || null
      eggUser.value[5][2] = data.user[5][2] || null
      eggUser.value[5][3] = data.user[5][3] || null
      eggUser.value[5][4] = data.user[5][4] || null
    }
  }
  catch(e){
    eggConfig.value = undefined
  }
}

getConfig()
watch(() => authStore.isLogin, (val) => !!val && getConfig())
watch(() => reward.value, (val) => !!val && getConfig())
</script>