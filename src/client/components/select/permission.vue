<template>
   <USelectMenu
    v-model="selected"
    :options="[1,2,3]"
    multiple
  >
    <template #label>
      <template v-if="selected.length > 0">
        <UBadge v-for="item in selected" :color="colors[item]" :key="item" size="xs" variant="soft">
          {{ names[item] }}
        </UBadge>
      </template>

      <template v-else>
        Chưa phân quyền
      </template>
    </template>

    <template #option="{ option }">
      {{ names[option] }}
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

const names = ref({
  1: 'SMOD',
  2: 'DEV',
  3: 'ADMIN'
})

const colors = ref({
  1: 'green',
  2: 'cyan',
  3: 'red'
})

watch(selected, val => {
  emit('update:modelValue', val)
})
</script>