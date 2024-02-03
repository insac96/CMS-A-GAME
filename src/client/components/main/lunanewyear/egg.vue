
<template>
  <div class="LunaPage2 LunaEggPage pt-[150px]">
    <UContainer>
      <UiFlex type="col" justify="center" class="mb-2">
        <UiText class="LunaTitle mb-1" size="4xl" align="center">Đập Trứng May Mắn</UiText>
        <UiText color="gray" align="center">Càng lên cao, quà càng khủng</UiText>
      </UiFlex>

      <UiFlex justify="center" class="mb-8">
        <div class="LunaBtnTitle" @click="view = true">Xem Trước Phần Thưởng</div>
      </UiFlex>

      <UiFlex justify="center" type="col">
        <UiFlex v-for="(value, row) in eggUser" :key="row" class="md:gap-6 gap-2">
          <div v-for="(egg, index) in value" :key="index" class="inline">
            <UiFlex class="relative md:w-24 md:h-32 w-16 h-24" justify="center" v-if="!egg" @click="openReceive(row, index)">
              <div class="LunaEggFrame"></div>
            </UiFlex>
            
            <UiFlex class="relative md:w-24 md:h-32 w-16 h-24" justify="center" v-else>
              <div class="LunaEggFrame LunaEggOpen"></div>

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

      <UModal v-model="view">
        <div class="p-4 pb-2">
          <UAccordion
            color="primary"
            variant="soft"
            size="md"
            :items="menuView"
            v-if="eggConfig"
          >
            <template #default="{ item, open }">
              <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
                {{ item.label }}
              </UButton>
            </template>

            <template #row1><UCard><DataItemList :items="eggConfig.row1" /></UCard></template>
            <template #row2><UCard><DataItemList :items="eggConfig.row2" /></UCard></template>
            <template #row3><UCard><DataItemList :items="eggConfig.row3" /></UCard></template>
            <template #row4><UCard><DataItemList :items="eggConfig.row4" /></UCard></template>
            <template #row5><UCard><DataItemList :items="eggConfig.row5" /></UCard></template>
          </UAccordion>
        </div>
      </UModal>

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
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const eggConfig = ref(undefined)
const gift = ref(undefined)

const open = ref(false)
const view = ref(false)
const reward = ref(undefined)
const loading = ref(false)

const menuView = [{
  label: 'Quà Hàng 1',
  slot: 'row1'
},{
  label: 'Quà Hàng 2',
  slot: 'row2'
},{
  label: 'Quà Hàng 3',
  slot: 'row3'
},{
  label: 'Quà Hàng 4',
  slot: 'row4'
},{
  label: 'Quà Hàng 5',
  slot: 'row5'
}]

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
      for (const [key, value] of Object.entries(eggUser.value)) {
        for (let i = 0; i < key; i++) {
          const findIndex = data.user[key].findIndex(o => o.index == i)
          eggUser.value[key][i] = findIndex == -1 ? null : data.user[key][findIndex]
        }
      }
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