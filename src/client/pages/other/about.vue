<template>
  <UiContent title="About" sub="Giới thiệu về chúng tôi">
    <DataEmpty v-if="!!loading || !about" :text="!!loading ? 'Đang tải...' : 'Không có dữ liệu'"></DataEmpty>

    <DataEditor :content="about" v-else />
  </UiContent>
</template>

<script setup>
const loading = ref(true)
const about = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/about')

    about.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>