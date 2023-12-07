<template>
  <div>
    <UForm :state="state" :validate="validate" @submit="submit">
      <UFormGroup name="server">
        <UiFlex>
          <SelectGameServer v-model="state.server" size="md" class="grow mr-1" />
          <UButton type="submit" size="md" :loading="loading">Xem</UButton>
        </UiFlex>
      </UFormGroup>
    </UForm>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }}" class="mt-4" v-if="list.length > 0">
      <LoadingTable v-if="loading" />

      <UTable :columns="columns" :rows="list">
        <template #power-data="{ row }">
          {{ useMoney().toMoney(row.power) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const loading = ref(false)

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
  }
]

const state = ref({
  server: null
})

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/rank/power', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    list.value = data
  }
  catch(e){
    loading.value = false
  }
}
</script>