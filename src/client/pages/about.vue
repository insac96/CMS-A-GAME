<template>
  <div class="max-w-[800px] mx-auto">
    <USkeleton class="w-full h-96" v-if="!!loading"/>

    <div v-else>
      <UiContent title="About" sub="Giới thiệu về chúng tôi" class="mb-4">
        <DataEmpty text="Chúng tôi đang cập nhật thông tin" v-if="!about"/>
        <DataEditor :content="about" v-else />
      </UiContent>

      <UiContent title="Contact" sub="Liên hệ với chúng tôi" class="mb-4">
        <UCard>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-business" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Tổ chức</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.name || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-map" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Địa chỉ</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.address || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-phone" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Điện thoại</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.phone || '...' }}</UiText>
          </UiFlex>
          <UiFlex>
            <UiIcon name="i-bxs-envelope" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Hòm thư</UiText>
            <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.email || '...' }}</UiText>
          </UiFlex>

          <template #footer>
            <UiFlex justify="center" class="gap-2" wrap>
              <UiImg 
                v-for="(value, key) in social" :key="key"
                class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
                :src="`/images/social/${key}.png`"
                w="1" h="1"
                imgW="90" imgH="90"
                :alt="key"
                @click="open(value)"
              ></UiImg>
            </UiFlex>
          </template>
        </UCard>
      </UiContent>
    </div>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Giới thiệu về chúng tôi - ${configStore.config.name}`,
})

const toast = useToast()
const loading = ref(true)
const about = ref(undefined)
const contact = ref({
  name: null,
  phone: null,
  email: null,
  address: null
})
const social = ref({
  facebook: null,
  messenger: null,
  telegram: null,
  zalo: null,
  tiktok: null,
  youtube: null,
})

const open = (url) => {
  if(!url) return toast.add({
    title: 'Thông báo',
    description: 'Chúng tôi đang cập nhật thông tin, vui lòng thử lại sau',
    color: 'red',
    icon: 'i-bxs-error',
    timeout: 2000
  })

  window.open(url, '_blank')
}

const get = async () => {
  try {
    const data = await useAPI('config/about')
    about.value = data.about
    contact.value = Object.assign(contact.value, data.contact)
    social.value = Object.assign(social.value, data.social)
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

get()
</script>