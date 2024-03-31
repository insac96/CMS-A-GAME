<template>
  <USelectMenu 
    v-model="money" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: 'Xu', value: 'coin' },
      { label: 'Cống hiến', value: 'diamond' }
    ]"
  >
    <template #label>
      <span v-if="money === undefined">Chọn tiền tệ</span>
      <span v-else>{{ money == 'coin' ? 'Xu' : 'Cống hiến' }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const money = computed({
  get: () => props.modelValue || 'coin',
  set: (value) => emit('update:modelValue', value)
})
</script>