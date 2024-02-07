<template>
  <UiContent title="Privacy" sub="Chính sách quyền riêng tư">
    <DataEmpty v-if="!!loading || !privacy" :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'"></DataEmpty>

    <DataEditor :content="privacy" v-else />
  </UiContent>
</template>

<script setup>
const loading = ref(true)
const privacy = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/privacy')

    privacy.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>