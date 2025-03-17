<template>
  <UiContent title="News" sub="Các tin tức mới nhất" icon="bx-news" class="w-[800px] max-w-full mx-auto">
    <template #more>
      <NuxtLink to="/main/news" class="ml-auto">
        <UButton color="gray">Xem thêm</UButton>
      </NuxtLink>
    </template>

    <div class="grid grid-cols-12 gap-4" v-if="!!loading">
      <LoadingNewsBox v-for="i in [1,2]" :key="i" class="col-span-6" />
    </div>
    
    <div v-else>
      <DataEmpty icon="i-bx-news" text="Không có tin tức mới" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-4" v-if="list.length > 0">
        <DataNewsBox 
          v-for="(item, index) in list" 
          :key="index" 
          class="md:col-span-4 col-span-6"
          :news="item"
        ></DataNewsBox>
      </div>
    </div>
  </UiContent>
</template>

<script setup>
const loading = ref(true)
const list = ref([])

const getLatest = async () => {
  try {
    const latest = await useAPI('news/latest')
    loading.value = false

    list.value = latest
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getLatest()
</script>