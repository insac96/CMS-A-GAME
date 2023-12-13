<template>
  <UCard :ui="{ body: { padding: 'p-4 sm:p-4' } }">
    <LoadingTable v-if="loading.load" />

    <div v-if="!loading.load">
      <DataEmpty text="Không có thông tin" icon="i-bx-gift" v-if="!rankgift" />

      <UForm :state="rankgift" v-if="rankgift">
        <UFormGroup label="Máy chủ">
          <SelectGameServer :model-value="rankgift.server" disabled />
        </UFormGroup>

        <UFormGroup label="Nhân vật" v-if="!!rankgift && !!rankgift.receice">
          <SelectGameRole v-model="stateReceive.role" :server="rankgift.server" />
        </UFormGroup>

        <UFormGroup :label="`Xếp hạng ${typeFormat[rankgift.type]}`">
          <UInput :model-value="rankgift.start == rankgift.end ? rankgift.start : `${rankgift.start} - ${rankgift.end}`" readonly />
        </UFormGroup>

        <UFormGroup label="Ngày có thể nhận">
          <UInput :model-value="useDayJs().displayFull(rankgift.expired)" readonly />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <UCard :ui="{ body: { padding: 'p-2 sm:p-2' } }">
            <DataItemList :items="rankgift.gift" class="justify-center"/>
          </UCard>
        </UFormGroup>
      </UForm>
    </div>

    <UiFlex justify="end" class="mt-4">
      <UButton v-if="!!rankgift && !!rankgift.receice" @click="receiceRankGift" :loading="loading.receive" class="mr-1" >Nhận</UButton>
      <UButton color="gray" :disabled="loading.receive" @click="emit('close')">Đóng</UButton>
    </UiFlex>
  </UCard>
</template>

<script setup>
const props = defineProps(['state'])
const emit = defineEmits(['close'])

const loading = ref({
  load: true,
  receive: false
})
const rankgift = ref(undefined)

const typeFormat = {
  level: 'cấp độ',
  power: 'lực chiến'
}

const stateReceive = ref({
  _id: null,
  role: null
})

const receiceRankGift = async () => {
  try {
    loading.value.receive = true
    stateReceive.value._id = rankgift.value._id

    await useAPI('game/rank/gift/receice', JSON.parse(JSON.stringify(stateReceive.value)))

    loading.value.receive = false
    emit('close')
  }
  catch(e){
    loading.value.receive = false
  }
}

const viewRankGift = async (rank, type) => {
  try {
    if(!props.state) return
    loading.value.load = true

    const data = await useAPI('game/rank/gift/get', {
      rank: props.state?.rank,
      type: props.state?.type,
      server: props.state?.server
    })

    rankgift.value = data
    loading.value.load = false
  }
  catch(e){
    loading.value.load = false
  }
}

viewRankGift()
</script>