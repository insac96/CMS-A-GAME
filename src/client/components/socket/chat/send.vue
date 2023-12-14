<template>
  <UForm :state="state" @submit="send">
    <UButtonGroup class="p-3 w-full">
      <UInput 
        v-model="state.text" 
        :disabled="loading" 
        :ui="{ variant: { outline: 'ring-0 focus:ring-0' } }"
        size="md" 
        placeholder="Nhập nội dung..." 
        class="w-full" 
      />
      <UButton type="submit" icon="i-bxs-send" :disabled="loading" size="md" />
    </UButtonGroup>
  </UForm>
</template>

<script setup>
const loading = ref(false)

const state = ref({
  text: null
})

const send = async () => {
  try {
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