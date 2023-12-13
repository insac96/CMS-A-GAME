<template>
  <div>
    <UTabs 
      v-model="tab" 
      :items="[
        { label: 'Rút tiền mặt' },
        { label: 'Mời bạn cùng chơi' },
        { label: 'Quà từ người giới thiệu' },
      ]" 
      :ui="{ wrapper: 'space-y-0' }"
      class="mb-2"
    />

    
    <MainActionWithdraw v-if="tab == 0" class="p-2" />
    <MainEventReferral v-if="tab == 1" />
    <DataReferralGiftInvited v-if="tab == 2" class="p-2" />
  </div>
</template>

<script setup>
const tab = ref(1)
</script>

