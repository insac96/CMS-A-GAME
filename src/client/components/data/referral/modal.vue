<template>
  <div class="fixed bottom-4 left-4" v-if="configStore.config.contact.prefix != 'ANB'">
    <UiImg 
      src="/images/icon/gift.png" 
      :w="1" :h="1" 
      :img-w="100" 
      :img-h="100" 
      class="md:w-[60px] md:h-[60px] w-[45px] h-[45px] jump-anim cursor-pointer"
      @click="modal = true"
    />

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[750px]'}">
      <DataReferralTabs class="p-2" />
    </UModal>
  </div>
</template>

<script setup>
const modal = ref(false)
const configStore = useConfigStore()
</script>