<template>
  <UiContent 
    title="Config" 
    sub="Chỉnh sửa cấu hình trang" 
    class="max-w-3xl mx-auto"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
          {{ item.label }}
        </UButton>
      </template>

      <template #enable>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đăng nhập</UiText>
            <UToggle v-model="state.enable.signin" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đăng ký</UiText>
            <UToggle v-model="state.enable.signup" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Giới thiệu</UiText>
            <UToggle v-model="state.enable.referral" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Chơi trò chơi</UiText>
            <UToggle v-model="state.enable.play" />
          </UiFlex>

          <div class="mb-4">
            <UiFlex justify="between" class="mb-2">
              <UiText weight="semibold">Landing Home</UiText>
              <UToggle v-model="state.enable.landing" />
            </UiFlex>

            <SelectAdsLanding v-model="state.homepage.landing" v-if="!!state.enable.landing" />
          </div>

          <UiFlex justify="between" class="mb-2">
            <UiText weight="semibold">Số tài khoản trên 1 IP</UiText>
            <UInput size="xs" class="w-[35px]" v-model="state.enable.signup_count" />
          </UiFlex>

          <UiFlex justify="end" class="mt-4">
            <UButton @click="update('enable')" :loading="updating">Cập nhật</UButton>
          </UiFlex>
        </UCard>
      </template>

      <template #basic>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên trang">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.short_name" />
            </UFormGroup>

            <UFormGroup label="Mô tả">
              <UTextarea autoresize v-model="state.description" name="input" />
            </UFormGroup>

            <UFormGroup label="Logo vuông">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Logo dài">
              <UiUploadImage v-model="state.logo_long_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_long_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Banner">
              <UiUploadImage v-model="state.og_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.og_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Link tải APK">
              <UInput v-model="state.download.apk" />
            </UFormGroup>

            <UFormGroup label="Link tải IOS">
              <UInput v-model="state.download.ios" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('basic')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #contact>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên tổ chức">
              <UInput v-model="state.contact.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.contact.prefix" />
            </UFormGroup>

            <UFormGroup label="Số điện thoại">
              <UInput v-model="state.contact.phone" />
            </UFormGroup>

            <UFormGroup label="Hòm thư">
              <UInput v-model="state.contact.email"/>
            </UFormGroup>

            <UFormGroup label="Địa chỉ">
              <UInput v-model="state.contact.address" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('contact')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #menu>
        <UCard class="mb-4">
          <UiText color="primary" weight="bold" class="mb-4">Chức năng</UiText>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Nạp xu</UiText>
            <UToggle v-model="state.menu.action.payment" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Giftcode</UiText>
            <UToggle v-model="state.menu.action.giftcode" />
          </UiFlex>
        </UCard>

        <UCard class="mb-4">
          <UiText color="primary" weight="bold" class="mb-4">Cửa hàng</UiText>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Gói</UiText>
            <UToggle v-model="state.menu.shop.pack" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Nạp trong game</UiText>
            <UToggle v-model="state.menu.shop.recharge" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Vật phẩm</UiText>
            <UToggle v-model="state.menu.shop.item" />
          </UiFlex>
        </UCard>

        <UCard class="mb-4">
          <UiText color="primary" weight="bold" class="mb-4">Sự kiện</UiText>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Mời bạn</UiText>
            <UToggle v-model="state.menu.event.referral" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Đăng nhập</UiText>
            <UToggle v-model="state.menu.event.login" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Tích nạp</UiText>
            <UToggle v-model="state.menu.event.pay" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Tiêu phí</UiText>
            <UToggle v-model="state.menu.event.spend" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Nạp đơn</UiText>
            <UToggle v-model="state.menu.event.paymusty" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Liên nạp</UiText>
            <UToggle v-model="state.menu.event.paydays" />
          </UiFlex>
        </UCard>

        <UCard class="mb-4">
          <UiText color="primary" weight="bold" class="mb-4">MiniGame</UiText>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Vòng quay</UiText>
            <UToggle v-model="state.menu.minigame.wheel" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Xúc xắc</UiText>
            <UToggle v-model="state.menu.minigame.dice" />
          </UiFlex>
        </UCard>

        <UCard>
          <UiText color="primary" weight="bold" class="mb-4">Xếp hạng</UiText>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">Cấp độ</UiText>
            <UToggle v-model="state.menu.rank.level" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">Lực chiến</UiText>
            <UToggle v-model="state.menu.rank.power" />
          </UiFlex>
        </UCard>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="update('menu')" :loading="updating">Cập nhật</UButton>
        </UiFlex>
      </template>

      <template #social>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('social')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UForm :state="state">
            <UiFlex justify="between" class="mb-4">
              <UiText weight="semibold">Mobile</UiText>
              <UToggle v-model="state.game.mobile" />
            </UiFlex>

            <UFormGroup label="Địa chỉ IP">
              <UInput v-model="state.game.ip" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.game.secret" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('game')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #facebook>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.facebook.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.facebook.client_secret" />
            </UFormGroup>

            <UFormGroup label="Version">
              <UInput v-model="state.facebook.client_version" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.facebook.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.facebook.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('facebook')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #google>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.google.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.google.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.google.client_verify" />
            </UFormGroup>

            <UFormGroup label="Ads">
              <UInput v-model="state.google.client_ads" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('google')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #tiktok>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.tiktok.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.tiktok.client_secret" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('tiktok')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #zalo>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="ID">
              <UInput v-model="state.zalo.client_id" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.zalo.client_secret" />
            </UFormGroup>

            <UFormGroup label="Verify">
              <UInput v-model="state.zalo.client_verify" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('zalo')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #thankyou>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Link kết thúc">
              <UInput v-model="state.thankyou.link" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('thankyou')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #other>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText color="gray">Mật khẩu ủy quyền</UiText>
            <UInput size="sm" class="w-[80px] ml-auto mr-1" v-model="state.gm_password" type="password" />
            <UButton @click="action('change-gm-password')">Lưu</UButton>
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText color="gray" size="sm">Reopen</UiText>
            <UButton color="gray" @click="action('reopen')">Thực hiện</UButton>
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText color="gray" size="sm">Xóa thông báo</UiText>
            <UButton color="gray" @click="action('del-notify')">Thực hiện</UButton>
          </UiFlex>

          <UiFlex justify="between">
            <UiText color="gray" size="sm">Đặt lại cấu hình</UiText>
            <UButton color="gray" @click="action('reset-config')">Thực hiện</UButton>
          </UiFlex>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',
  logo_long_image: '',
  makeby: '',
  gm_password: '',

  menu: {
    action: {
      payment: false,
      giftcode: false,
    },
    shop: {
      pack: false,
      item: false,
      recharge: false
    },
    event: {
      referral: false,
      login: false,
      pay: false,
      spend: false,
      paymusty: false,
      paydays: false
    },
    minigame: {
      wheel: false,
      dice: false
    },
    rank: {
      level: false,
      power: false
    },
    social: {
      facebook: false,
      group: false,
    }
  },

  enable: {
    signin: true,
    signup: true,
    play: true,
    referral: true,
    landing: false,
    signup_count: 0
  },

  thankyou: {
    link: ''
  },

  homepage: {
    landing: null,
  },

  download: {
    apk: '',
    ios: '',
  },

  contact: {
    name: '',
    phone: '',
    email: '',
    address: '',
    prefix: '',
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: ''
  },

  game: {
    ip: '',
    mobile: false,
    secret: '',
  },

  facebook: {
      client_id: '',
      client_secret: '',
      client_version: '',
      client_verify: '',
      client_ads: ''
    },
    google: {
      client_id: '',
      client_secret: '',
      client_verify: '',
      client_ads: ''
    },
    tiktok: {
      client_id: '',
      client_secret: '',
      client_verify: '',
    },
    zalo: {
      client_id: '',
      client_secret: '',
      client_verify: '',
    }
})

const menu = [
{
  label: 'Cho phép',
  slot: 'enable'
},
{
  label: 'Cơ bản',
  slot: 'basic'
},
{
  label: 'Liên hệ',
  slot: 'contact'
},
{
  label: 'Mạng xã hội',
  slot: 'social'
},
{
  label: 'Menu',
  slot: 'menu'
},
{
  label: 'Trò chơi',
  slot: 'game'
},
{
  label: 'Facebook',
  slot: 'facebook'
},
{
  label: 'Google',
  slot: 'google'
},
{
  label: 'Tiktok',
  slot: 'tiktok'
},
{
  label: 'Zalo',
  slot: 'zalo'
},
{
  label: 'Thank You',
  slot: 'thankyou'
},
{
  label: 'Khác',
  slot: 'other'
}
]

const getConfig = async () => {
  const config = await useAPI('config/admin/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/admin/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

const action = async (type) => {
  try {
    if(!!updating.value) return error('Có 1 tiến trình đang xử lý, vui lòng đợi')
    
    updating.value = true
    await useAPI('config/admin/action', {
      type: type,
      gm_password: state.value.gm_password
    })

    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>