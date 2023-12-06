<template>
  <UiContent title="Terms" sub="Điều khoản dịch vụ" class="max-w-[800px] mx-auto">
    <USkeleton class="w-full h-96" v-if="!!loading"/>
    <div v-else>
      <DataEmpty text="Chúng tôi đang cập nhật thông tin" v-if="!content"/>
      <DataEditor :content="content" v-else />
    </div>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Điều khoản dịch vụ - ${configStore.config.name}`,
})

const loading = ref(true)
const content = ref(undefined)

const get = async () => {
  try {
    const data = await useAPI('config/terms')
    content.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>