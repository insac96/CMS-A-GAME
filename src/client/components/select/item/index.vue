<template>
  <USelectMenu
    v-model="item"
    searchable
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="name"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : 'Chọn vật phẩm' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  itemData: Object,
  types: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'update:itemData'])

const options = ref([])

const item = computed({
  get: () => props.modelValue,
  set: (value) => {
    const itemData = options.value.find(i => i._id === value)
    emit('update:modelValue', value)
    emit('update:itemData', itemData)
  }
}) 

const select = computed(() => options.value.find(i => i._id === item.value))

const fetch = async () => {
  const items = await useAPI('item/select', {
    types: JSON.parse(JSON.stringify(props.types))
  })
  
  options.value = items.map(i => ({ 
    _id: i._id, 
    item_id: i.item_id,
    name: i.item_name,
    image: i.item_image,
    type: i.type
  }))
}

fetch()
</script>