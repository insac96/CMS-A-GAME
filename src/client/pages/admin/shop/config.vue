<template>
  <UiContent 
    title="Config Shop" 
    sub="Cài đặt cửa hàng" 
    class="max-w-3xl mx-auto"
  >
    <UAlert title="Khuyến Mãi" :ui="{ title: 'text-primary font-bold'}" class="mb-4">
      <template #description>
        <UForm :state="state" @submit="update" class="mt-4">
          <UFormGroup label="Phần trăm">
            <UInput v-model="state.discount.number" type="number" />
          </UFormGroup>

          <UFormGroup label="Thời hạn">
            <SelectDate v-model="state.discount.expired" />
          </UFormGroup>

          <UiFlex justify="end">
            <UButton type="submit" color="gray" :loading="updating">Cập nhật</UButton>
          </UiFlex>
        </UForm>
      </template>
    </UAlert>
  </UiContent>
</template>

<script setup>
const load = ref(true)
const updating = ref(false)

const state = ref({
  discount: {
    number: null,
    expired: null
  }
})

const getConfig = async () => {
  const config = await useAPI('shop/admin/config/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true
    await useAPI('shop/admin/config/update', JSON.parse(JSON.stringify(state.value)))

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}
</script>