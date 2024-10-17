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
        <template #level-data="{ row }">
          {{ useMoney().toMoney(row.level) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const loading = ref({
  load: false
})

const list = ref([])

const columns = [
  {
    key: 'rank',
    label: 'Hạng',
  },{
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'level',
    label: 'Cấp độ'
  }
]

const state = ref({
  server: null
})


watch(() => state.value.server, (val) => !!val && submit())

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  return errors
}

const submit = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/rank/level', JSON.parse(JSON.stringify(state.value)))

    loading.value.load = false
    list.value = data
  }
  catch(e){
    loading.value.load = false
  }
}
</script>