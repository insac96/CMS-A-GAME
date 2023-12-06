<template>
  <UiContent title="News" sub="Cập nhật các tin tức mới nhất">
    <div class="grid grid-cols-12 gap-4" v-if="loading">
      <LoadingNewsBox v-for="i in [1,2]" :key="i" class="md:col-span-6 col-span-12" />
    </div>
    
    <div v-else>
      <DataEmpty icon="i-bx-news" text="Không có tin tức mới" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-4" v-if="list.length > 0">
        <DataNewsBox 
          v-for="(item, index) in list" 
          :key="index" 
          :class="{
            [`${col[index]}`] : !!col[index]
          }"
          :news="item"
        ></DataNewsBox>
      </div>

      <UiFlex justify="center" class="mt-6" v-if="list.length > 0">
        <NuxtLink to="/main/news">
          <UButton icon="i-bx-news" variant="soft">Xem thêm</UButton>
        </NuxtLink>
      </UiFlex>
    </div>
  </UiContent>
</template>

<script setup>
const loading = ref(true)
const list = ref([])

const col = computed(() => {
  const size = list.value.length
  const cols = {
    0: null, 1: null, 2: null, 3: null, 4: null, 5: null
  }

  if(size == 1) cols[0] = 'col-span-12'
  if(size == 2) cols[0] = cols[1] = 'md:col-span-6 col-span-12'
  if(size == 3) {
    cols[0] = 'xl:col-span-4 md:col-span-12 col-span-12'
    cols[1] = cols[2] = 'xl:col-span-4 md:col-span-6 col-span-12'
  }
  if(size == 4) {
    cols[0] = cols[1] = cols[2] = cols[3] = 'md:col-span-6 col-span-12'
  }
  if(size == 5) {
    cols[0] = 'xl:col-span-6 md:col-span-12 col-span-12'
    cols[1] = 'xl:col-span-6 md:col-span-6 col-span-12'
    cols[2] = 'xl:col-span-4 md:col-span-6 col-span-12'
    cols[3] = cols[4] = 'xl:col-span-4 md:col-span-6 col-span-12'
  }
  if(size == 6){
    cols[0] = cols[1] = cols[2] = cols[3] = cols[4] = cols[5] = 'xl:col-span-4 md:col-span-6 col-span-12'
  }
  return cols
})

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