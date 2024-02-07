<template>
  <div class="w-full h-full fixed top-0 left-0" v-if="!!teaser">
    <iframe 
      title="Teaser Page"
      :src="teaser.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <UModal v-model="modal.up">
      <div class="p-2">
        <AuthSignTeaserUp @done="thankyou" :teaser="teaser._id" />
      </div>
    </UModal>

    <UModal v-model="modal.giftcode">
      <UiFlex type="col" class="px-4 py-6">
        <UiIcon name="i-bx-gift" color="red" size="24" class="mb-4"></UiIcon>
        <UiText size="sm" color="gray" class="mb-1">Bạn đã đăng ký tài khoản thành công</UiText>
        <UiText weight="semibold" class="mb-1">Giftcode Open</UiText>
        <UiText weight="bold" color="red">VIP666, VIP888, VIP999</UiText>

        <UButton size="md" color="gray" class="mt-4" @click="toGroupBeta">Tham Gia Group Close Beta</UButton>
      </UiFlex>

      <UiFlex class="p-2 pt-0" justify="end" v-if="authStore.isLogin && authStore.profile.type > 0">
        <PlayBtn text="Chơi" class="mr-1"></PlayBtn>
        <UButton size="md" color="gray" @click="navigateTo('/admin')">Quản trị viên</UButton>
      </UiFlex>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'ads'
})

const { error } = useNotify()
const { imgLink } = useMakeLink()
const configStore = useConfigStore()
const authStore = useAuthStore()
const route = useRoute()
const teaser = ref(undefined)

const modal = ref({
  up: false,
  giftcode: false
})

onMounted(() => {
  window.addEventListener('message', runAction, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', runAction, false)
})

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',
  'notify': 'notify',

  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const makeImgLink = (src, type) => {
  if(!!src){
    const imagePath = configStore.config.game.image
    return imgLink(!imagePath ? src : `${imagePath}/${src}`)
  }
  else {
    if(!!type) return imgLink(`/images/icon/${typeFormat[type]}.png`)
    return null
  }
}

const runAction = (e) => {
  const data = e.data
  if(!data) return

  if(data == 'signup'){
    if(!authStore.isLogin) return modal.value.up = true
    else modal.value.giftcode = true
  }
  else if(data == 'facebook'){
    if(!configStore.config.social.facebook) return error('Chúng tôi sẽ cập nhật thông tin sau')
    window.open(configStore.config.social.facebook, '_blank')
  }
  else if(data == 'zalo'){
    if(!configStore.config.social.zalo) return error('Chúng tôi sẽ cập nhật thông tin sau')
    window.open(configStore.config.social.zalo, '_blank')
  }
}

const toGroupBeta = (e) => {
  if(!configStore.config.social.messenger) return error('Chúng tôi sẽ cập nhật thông tin sau')
  window.open(configStore.config.social.messenger, '_blank')
}

const thankyou = async () => {
  modal.value.up = false
  useTo().navigateToSSL('/thankyou?type=teaser')
}

const getTeaser = async () => {
  try {
    const data = await useAPI('ads/teaser/code', { code: route.params.code })
    teaser.value = data

    teaser.value.gift = teaser.value.gift.map(i => {
      i.image = makeImgLink(i.image, i.type)
      return i
    })

    if(process.client){
      setTimeout(() => {
        const iframe = document.querySelector('iframe')
        iframe.contentWindow.postMessage(JSON.stringify(teaser.value), "*")
      }, 1000)
    }
  }
  catch (e) {
    return false
  }
}

getTeaser()
</script>