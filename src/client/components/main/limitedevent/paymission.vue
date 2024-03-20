
<template>
  <UContainer class="lg:pb-28 pb-16">
    <UiFlex class="LimitedEventPage__Title" type="col" justify="center">
      <img src="/images/limitedevent/title.png" />
      <UiText class="LimitedEventPage__Title__Text sm:text-3xl text-xl sm:mb-2" weight="bold">Nạp Đúng Mốc</UiText>
    </UiFlex>

    <UiFlex justify="center" class="gap-6 mt-20" wrap>
      <UiFlex class="LimitedEventPayMission lg:w-[14.7875354vw] lg:h-[15vw] w-[29.5750708vw] h-[30vw]" justify="center" @click="openReceive(event)" v-for="event in list" :key="event._id">
        <UiFlex justify="center" class="LimitedEventPayMission__Text lg:h-[2.5vw] h-[5vw] lg:text-xl">Nạp {{ useMoney().miniMoney(event.need) }}</UiFlex>
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
    await useAPI('auth/get')
    await useAPI('limitedevent/paymission/receive', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    open.value = false
  }
  catch(e){
    loading.value = false
  }
}

const getList = async () => {
  try {
    const data = await useAPI('limitedevent/paymission/list')
    list.value = data
  }
  catch(e){
    list.value = []
  }
}

getList()
</script>