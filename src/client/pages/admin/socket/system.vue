<template>
  <UiContent 
    title="System" 
    sub="Chức năng hệ thống" 
    class="max-w-3xl mx-auto"
  >
    <UAlert icon="i-bx-chat" title="Xóa kênh Chat" :ui="{ title: 'text-primary font-bold'}" class="mb-4">
      <template #description>
        <UiText size="sm">Xóa toàn bộ tất cả các tin nhắn trên hệ thống</UiText>
        <UiFlex justify="end">
          <UButton color="gray" :loading="loading.delAllChat" @click="delAllChat">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert icon="i-bx-revision" title="Buộc tải lại" :ui="{ title: 'text-primary font-bold'}">
      <template #description>
        <UiText size="sm">Ép tất cả máy khách tải lại trang</UiText>
        <UiFlex justify="end">
          <UButton color="gray" :loading="loading.reloadPage" @click="reloadPage">Chạy</UButton>
        </UiFlex>
      </template>
    </UAlert>
  </UiContent>
</template>

<script setup>
const loading = ref({
  delAllChat: false,
  reloadPage: false
})

const delAllChat = async () => {
  try {
    loading.value.delAllChat = true
    await useAPI('socket/admin/system/delAllChat')

    loading.value.delAllChat = false
  }
  catch (e) {
    loading.value.delAllChat = false
  }
}

const reloadPage = async () => {
  try {
    loading.value.reloadPage = true
    await useAPI('socket/admin/system/reloadPage')

    loading.value.reloadPage = false
  }
  catch (e) {
    loading.value.reloadPage = false
  }
}
</script>