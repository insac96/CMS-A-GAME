<template>
  <NuxtLink v-if="news" :to="`/main/news/${news._id}`">
    <UCard
      :ui="{ 
        base: 'relative transition-all overflow-hidden',
        background: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        rounded: 'rounded-xl',
        shadow: 'shadow-md hover:shadow-lg',
        header: { padding: 'p-0 sm:p-0' },
        footer: { padding: 'pt-0 sm:pt-0' },
        divide: '',
        ring: 'dark:ring-1 ring-0 hover:ring-2 dark:hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400'
      }"
    > 
      <template #header>
        <UiImg :src="news.og_image" w="4" h="2" />
      </template>
      
      <UiText 
        color="primary" 
        weight="bold"
        class="truncate lg:text-xl md:text-lg mb-2"
      >
        {{ news.title }}
      </UiText>

      <UiText 
        color="gray" 
        class="lg:text-lg line-clamp-2"
      >
      {{ news.description }}
      </UiText>

      <template #footer>
        <UiFlex>
          <UiIcon v-if="news.pin == 1" color="primary" name="i-bxs-pin" size="4" class="mr-2" />

          <UiText color="gray" weight="semibold" class="md:text-sm text-xs mr-auto">
            {{ displayTime(news.updatedAt) }}
          </UiText>

          <UBadge :color="news.category?.color || 'primary'">
            {{ news.category?.name || 'News' }}
          </UBadge>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
defineProps(['news'])

const { displayTime } = useDayJs()
</script>