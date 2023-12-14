<template>
  <UiFlex 
    items="start"
    type="col"
    class="
      w-full h-full 
      overflow-x-hidden overflow-y-auto
      p-3 gap-y-4
    "
    id="BoxChat"
  >
    <UiFlex v-for="chat in chats" :key="chat._id" class="w-full">
      <UiFlex class="w-full space-x-2 max-w-[300px] ml-auto" items="start" justify="end" v-if="!!authStore.isLogin && authStore.profile._id == chat.user._id">
        <!-- Info -->
        <div>
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-l-lg rounded-br-lg mb-2">
            <UiFlex class="mb-1">
              <UiText size="xs" color="primary" weight="semibold" class="capitalize">{{ chat.user.username }}</UiText>
            </UiFlex>
            <UiText size="sm">{{ chat.text }}</UiText>
          </div>

          <UiText color="gray" size="xs" class="leading-none mx-2" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
        </div>

        <!-- Avatar -->
        <UiImg :src="chat.user.avatar" w="1" h="1" img-w="100" img-h="100" class="w-8 h-8 rounded-full" />
      </UiFlex>

      <UiFlex class="w-full space-x-2 max-w-[300px]" items="start" v-else>
        <!-- Avatar -->
        <UiImg :src="chat.user.avatar" w="1" h="1" img-w="100" img-h="100" class="w-8 h-8 rounded-full" />
        
        <!-- Info -->
        <div>
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-r-lg rounded-bl-lg mb-2">
            <UiFlex class="mb-1">
              <UiText size="xs" color="primary" weight="semibold" class="capitalize">{{ chat.user.username }}</UiText>
            </UiFlex>
            <UiText size="sm">{{ chat.text }}</UiText>
          </div>

          <UiText color="gray" size="xs" class="leading-none mx-2" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
        </div>
      </UiFlex>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()

const box = ref(null)

const list = ref(undefined)

const loading = ref(true)

const chats = computed(() => {
  if(!list.value) return []
  return list.value.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
})

const toBottom = () => {
  const box = document.getElementById('BoxChat')
  box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' })
}

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('socket/chat/list')

    list.value = data
    loading.value = false
    setTimeout(() => toBottom(), 100)
  }
  catch {
    loading.value = false
  }
}

onMounted(() => {
  if(process.client) getList()

  $socket.on('chat-push', (data) => {
    if(!list.value) list.value = []
    list.value.push(data)
    setTimeout(() => toBottom(), 100)
  })
})


</script>