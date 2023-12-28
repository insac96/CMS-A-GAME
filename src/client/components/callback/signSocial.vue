<template>
  <UiFlex type="col">
    <UiImg 
      class="max-w-[150px] max-h-[150px] cursor-pointer rounded-full mb-4"
      :src="`/images/social/${type}.png`"
      w="1" h="1"
      imgW="200" imgH="200"
      :alt="type"
      preload
    ></UiImg>

    <UiText color="primary" size="3xl" weight="bold" class="capitalize">OAuth {{type}}</UiText>
    <UiText color="gray" size="sm" class="mb-4">{{ text }}</UiText>
    <UiIcon color="primary" name="i-bx-loader-alt" class="animate-spin" size="5" v-if="!!loading" />
    <UButton @click="useTo().navigateToSSL('/')" v-else>Trang Chủ</UButton>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['type'])
const { link } = useMakeLink()
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const loading = ref(true)
const text = ref('Vui lòng đợi')

const sign = async () => {
  try {
    const query = route.query
    if(Object.keys(query).length == 0) throw 'Không có quyền truy cập'
    if(!!query.error) throw 'Xảy ra lỗi trong quá trình xác thực'
    if(!query.code) throw 'Không tìm thấy mã xác thực'

    query.redirect_uri = link(`/callback/sign/${props.type}`)
    const token = await useAPI(`auth/sign/social/${props.type}`, query)
    const cookie = useCookie('token-auth', runtimeConfig.public.cookieConfig)

    cookie.value = token
    setTimeout(() => {
      useTo().navigateToSSL('/')
    }, 500)
  }
  catch (e) {
    loading.value = false
    text.value = e
  }
}

sign()
</script>