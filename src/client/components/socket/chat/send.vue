<template>
  <UForm :state="state" @submit="send">
    <UiFlex class="p-2 gap-1">
      <UInput 
        v-model="state.text" 
        :disabled="loading" 
        :ui="{ 
          color: {
            gray: {
              outline: 'ring-0 focus:ring-0'
            }
          } 
        }"
        color="gray"
        variant="outline"
        placeholder="Nhập nội dung..." 
        class="w-full" 
        size="sm"
      />

      <UButton type="submit" icon="i-bxs-send" :disabled="loading" size="sm" />
    </UiFlex>
  </UForm>
</template>

<script setup>
const authStore = useAuthStore()
const loading = ref(false)

const state = ref({
  text: null
})

const send = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước')
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(!!loading.value) return
    loading.value = true

    await useAPI('socket/chat/send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    loading.value = false
  }
  catch (e){
    loading.value = false
  }
}
</script>