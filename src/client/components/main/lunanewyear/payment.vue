
<template>
  <UContainer>
    <UiFlex type="col" justify="center" class="mb-8 md:mb-14">
      <UiText class="LunaTitle mb-1" size="4xl" align="center">Tích Lũy Nạp</UiText>
      <UiText color="gray" align="center">Nạp liên tiếp giá trị bất kỳ, nhận ngay quà VIP</UiText>
    </UiFlex>

    <UiFlex justify="center" class="gap-6" wrap>
      <UiFlex class="LunaPayment" justify="between" type="col" v-for="event in list" :key="event._id">
        <div class="LunaBtnText text-lg">Ngày {{ event.need }}</div>
        
        <DataItemListMini amount-color="red" size="2xl" :items="event.gift" :max="2" class="mt-4" />

        <div class="LunaBtn" @click="openReceive(event)"></div>
      </UiFlex>
    </UiFlex>

    <UModal prevent-close v-model="open">
      <UForm :state="state" @submit="submit" class="p-4" v-if="eventSelect">
        <UFormGroup label="Liên nạp">
          <UInput :value="`Ngày ${eventSelect.need}`" readonly />
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
    await useAPI('lunanewyear/payment/receive', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    open.value = false
  }
  catch(e){
    loading.value = false
  }
}

const getList = async () => {
  try {
    const data = await useAPI('lunanewyear/payment/list')
    list.value = data
  }
  catch(e){
    list.value = []
  }
}

getList()
</script>