<template>
  <div 
    class="
      relative
      w-full h-full 
      overflow-x-hidden overflow-y-auto
      p-3
    "
    id="BoxChat"
  >
    <LoadingTable class="rounded-none" v-if="!!loading" />

    <UiFlex type="col" class="w-full gap-y-4" v-else>
      <UiFlex v-for="chat in chats" :key="chat._id" class="w-full">
        <!-- Right -->
        <UiFlex class="w-full space-x-2 max-w-[300px] ml-auto" items="start" justify="end" v-if="!!authStore.isLogin && authStore.profile._id == chat.user._id">
          <!-- Info -->
          <div class="text-right">
            <UiFlex justify="end" class="mb-1">
              <UBadge :color="typeFormat[chat.user.type].color" variant="soft" size="xs" class="capitalize mr-1">{{ chat.user.username }}</UBadge>
              <UBadge color="primary" variant="soft" size="xs">
                Cấp {{ chat.user.level ? chat.user.level?.number || 0 : 0 }}
              </UBadge>
            </UiFlex>

            <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-l-lg rounded-br-lg text-right mb-2">
              <UiText size="sm" v-html="chat.text"></UiText>
            </div>

            <UiText color="gray" class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
          </div>

          <!-- Avatar -->
          <UiImg :src="chat.user.avatar" w="1" h="1" img-w="100" img-h="100" class="w-8 h-8 rounded-full" />
        </UiFlex>

        <!-- Left -->
        <UiFlex class="w-full space-x-2 max-w-[300px]" items="start" v-else>
          <!-- Avatar -->
          <UiImg :src="chat.user.avatar" w="1" h="1" img-w="100" img-h="100" class="w-8 h-8 rounded-full" />
          
          <!-- Info -->
          <div class="text-left">
            <UiFlex justify="start" class="mb-1">
              <UBadge :color="typeFormat[chat.user.type].color" variant="soft" size="xs" class="capitalize mr-1">{{ chat.user.username }}</UBadge>
              <UBadge color="primary" variant="soft" size="xs">
                Cấp {{ chat.user.level ? chat.user.level?.number || 0 : 0 }}
              </UBadge>
            </UiFlex>

            <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-r-lg rounded-bl-lg text-left mb-2">
              <UiText size="sm" v-html="chat.text"></UiText>
            </div>

            <UiText color="gray" class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
          </div>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()

const list = ref(undefined)

const loading = ref(true)

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

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

  $socket.on('chat-reload', () => getList())
})


</script>