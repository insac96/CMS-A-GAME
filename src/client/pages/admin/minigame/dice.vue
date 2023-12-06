<template>
  <UiContent 
    title="Dice Lucky" 
    sub="Chỉnh sửa thông số xúc xắc" 
    class="max-w-3xl mx-auto"
  >
    <UForm @submit="update" :state="state">
      <UFormGroup label="Hũ mặc định">
        <UInput v-model="state.jar.default" />
      </UFormGroup>

      <UFormGroup label="Hũ hiện tại">
        <UInput v-model="state.jar.now" />
      </UFormGroup>

      <UFormGroup label="Tỷ lệ hũ 666">
        <UInput v-model="state.percent.six" />
      </UFormGroup>

      <UFormGroup label="Tỷ lệ hũ khác">
        <UInput v-model="state.percent.other" />
      </UFormGroup>

      <UiFlex justify="end" class="mt-6">
        <UButton type="submit" :loading="loading.update" class="mr-1">Cập nhật</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const loading = ref({
  load: true,
  update: false
})

const state = ref({
  jar: {
    default: null,
    now: null
  },
  percent: {
    six: null,
    other: null
  }
})

const update = async () => {
  try {
    loading.value = true

    await useAPI('minigame/dice/admin/update', JSON.parse(JSON.stringify(state.value)))
    getConfig()
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}

const getConfig = async () => {
  const config = await useAPI('minigame/dice/admin/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>