<template>
  <USelectMenu
    v-model="server"
    :options="options"
    size="lg"
    value-attribute="value"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : 'Chọn máy chủ' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])

const loading = ref(true)

const server = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i.value === server.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('game/server')

    loading.value = false
    options.value = options.value.concat(list.map(i => ({ value: i.server_id, label: i.server_name })))
  }
  catch (e){
    loading.value = false
    options.value = []
  }
}

fetch()
</script>