
<template>
  <UContainer>
    <UiFlex type="col" justify="center" class="mb-2 md:mb-8">
      <UiText class="LunaTitle mb-1" size="4xl" align="center">Nạp Mốc Mỗi Ngày</UiText>
      <UiText color="gray" align="center">Nạp đúng số tiền chỉ định, nhận quà cực sốc</UiText>
    </UiFlex>

    <UiFlex justify="center" wrap>
      <UiFlex class="LunaPayMission" justify="center" type="col" v-for="event in list" :key="event._id">
        <UiText class="LunaTitle text-white" size="xl">Nạp {{ useMoney().miniMoney(event.need) }}</UiText>

        <DataItemListMini amount-color="red" size="2xl" :items="event.gift" :max="3" class="mt-2 mb-3" />
        
        <div class="LunaBtn" @click="openReceive(event)"></div>
      </UiFlex>
    </UiFlex>

    <UModal prevent-close v-model="open">
      <UForm :state="state" @submit="submit" class="p-4" v-if="eventSelect">
        <UFormGroup label="Nạp ngày">
          <UInput :value="useMoney().toMoney(eventSelect.need) + ' VNĐ'" readonly />
        </UFormGroup>

        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="state.server" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" v-if="state.server" >
          <SelectGameRole v-model="state.role" :server="state.server" />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <UCard>
            <UiFlex justify="center">
              <DataItemList :items="eventSelect.gift" />
            </UiFlex>
          </UCard>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="submit" :loading="loading" class="mr-1">Xác Nhận</UButton>
          <UButton color="gray" :disabled="loading" @click="open = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UContainer>
</template>

<script setup>
const authStore = useAuthStore()
const list = ref([])
const open = ref(false)
const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  payment: null
})

const eventSelect = ref(undefined)

const openReceive = (event) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  eventSelect.value = event
  open.value = true
}

const submit = async () => {
  try {
    if(!eventSelect.value) return
    
    loading.value = true
    state.value.payment = eventSelect.value._id
    await useAPI('lunanewyear/paymission/receive', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    open.value = false
  }
  catch(e){
    loading.value = false
  }
}

const getList = async () => {
  try {
    const data = await useAPI('lunanewyear/paymission/list')
    list.value = data
  }
  catch(e){
    list.value = []
  }
}

getList()
</script>