<template>
  <UiContent 
    title="Lunar Lucky Egg" 
    sub="Chỉnh sửa cấu hình đập trứng" 
    class="max-w-3xl mx-auto"
  >
    <UForm :state="state" @submit="submit">
      <UAccordion
        color="primary"
        variant="soft"
        size="md"
        :items="menu"
      >
        <template #default="{ item, index, open }">
          <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
            {{ item.label }}
          </UButton>
        </template>

        <template #row1>
          <UFormGroup label="Giá đập">
            <UInput v-model="state.price1" type="number"></UInput>
          </UFormGroup>

          <SelectItemListRate v-model="state.row1" :types="['game_item', 'coin', 'wheel']" />
        </template>

        <template #row2>
          <UFormGroup label="Giá đập">
            <UInput v-model="state.price2" type="number"></UInput>
          </UFormGroup>
          <SelectItemListRate v-model="state.row2" :types="['game_item', 'coin', 'wheel']" />
        </template>

        <template #row3>
          <UFormGroup label="Giá đập">
            <UInput v-model="state.price3" type="number"></UInput>
          </UFormGroup>
          <SelectItemListRate v-model="state.row3" :types="['game_item', 'coin', 'wheel']" />
        </template>

        <template #row4>
          <UFormGroup label="Giá đập">
            <UInput v-model="state.price4" type="number"></UInput>
          </UFormGroup>
          <SelectItemListRate v-model="state.row4" :types="['game_item', 'coin', 'wheel']" />
        </template>

        <template #row5>
          <UFormGroup label="Giá đập">
            <UInput v-model="state.price5" type="number"></UInput>
          </UFormGroup>
          <SelectItemListRate v-model="state.row5" :types="['game_item', 'coin', 'wheel']" />
        </template>
      </UAccordion>

      <UiFlex justify="end">
        <UButton type="submit" :loading="loading">Lưu Cấu Hình</UButton>
      </UiFlex>
    </UForm>

    <UForm :state="stateReset" @submit="reset">
      <UFormGroup label="Reset dữ liệu tài khoản">
        <SelectUser v-model="stateReset.user"></SelectUser>
      </UFormGroup>

      <UiFlex justify="end">
        <UButton type="submit" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const loading = ref(false)

const state = ref({
  price1: 0,
  price2: 0,
  price3: 0,
  price4: 0,
  price5: 0,
  row1: [],
  row2: [],
  row3: [],
  row4: [],
  row5: [],
})

const stateReset = ref({
  user: null
})

const menu = [{
  label: 'Hàng 1',
  slot: 'row1'
},{
  label: 'Hàng 2',
  slot: 'row2'
},{
  label: 'Hàng 3',
  slot: 'row3'
},{
  label: 'Hàng 4',
  slot: 'row4'
},{
  label: 'Hàng 5',
  slot: 'row5'
}]

const submit = async () => {
  try {
    loading.value = true
    await useAPI('lunanewyear/egg/admin/update', JSON.parse(JSON.stringify(state.value)))

    getConfig()
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

const reset = async () => {
  try {
    loading.value = true
    await useAPI('lunanewyear/egg/admin/reset', JSON.parse(JSON.stringify(stateReset.value)))
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

const getConfig = async () => {
  const data = await useAPI('lunanewyear/egg/admin/get')
  state.value = Object.assign(state.value, data)
}

getConfig()
</script>