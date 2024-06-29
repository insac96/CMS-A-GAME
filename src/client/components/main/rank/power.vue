<template>
  <div>
    <UForm :state="state" :validate="validate" @submit="submit">
      <UFormGroup name="server">
        <UiFlex>
          <SelectGameServer auto v-model="state.server" size="md" class="grow mr-1" />
          <UButton type="submit" size="md" :loading="loading.load">Xem</UButton>
        </UiFlex>
      </UFormGroup>
    </UForm>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }}" class="mt-4" v-if="list.length > 0">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="columns" :rows="list">
        <template #power-data="{ row }">
          {{ useMoney().toMoney(row.power) }}
        </template>

        <template #gift-data="{ row }">
          <UButton size="xs" color="gray" @click="viewRankGift(row.rank, 'power')">Xem</UButton>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="modal.view" prevent-close>
      <DataRankGiftView :state="stateView" @close="modal.view = false" />
    </UModal>
  </div>
</template>

<script setup>
const loading = ref({
  load: false,
  view: false
})

const list = ref([])

const columns = [
  {
    key: 'rank',
    label: 'Xếp hạng',
  },{
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'power',
    label: 'Lực chiến'
  },{
    key: 'gift',
    label: 'Phần thưởng'
  }
]

const modal = ref({
  view: false
})

const state = ref({
  server: null
})

const stateView = ref({
  rank: null,
  type: null,
  server: null
})

watch(() => state.value.server, (val) => !!val && submit())

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  return errors
}

const viewRankGift = async (rank, type) => {
  stateView.value.rank = rank
  stateView.value.type = type
  stateView.value.server = state.value.server
  modal.value.view = true
}

const submit = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/rank/power', JSON.parse(JSON.stringify(state.value)))

    loading.value.load = false
    list.value = data
  }
  catch(e){
    loading.value.load = false
  }
}
</script>