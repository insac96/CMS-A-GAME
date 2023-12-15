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

            <UFormGroup label="Logo">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
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

      <!-- <template #about>
        <UiEditor v-model="state.about" v-if="!load" />
      </template>

      <template #privacy>
        <UiEditor v-model="state.privacy" v-if="!load" />
      </template>

      <template #terms>
        <UiEditor v-model="state.terms" v-if="!load" />
      </template> -->

      <template #social>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <!-- <UFormGroup label="Telegram">
              <UInput v-model="state.social.telegram" />
            </UFormGroup> -->

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <!-- <UFormGroup label="Tiktok">
              <UInput v-model="state.social.tiktok" />
            </UFormGroup>

            <UFormGroup label="Youtube">
              <UInput v-model="state.social.youtube" />
            </UFormGroup> -->

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('social')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Landing">
              <UInput v-model="state.game.landing" />
            </UFormGroup>

            <UFormGroup label="Secret">
              <UInput v-model="state.game.secret" />
            </UFormGroup>

            <UFormGroup label="Path Image">
              <UInput v-model="state.game.image" />
            </UFormGroup>

            <UFormGroup label="API Get OS">
              <UInput v-model="state.game.api.os" />
            </UFormGroup>
            
            <UFormGroup label="API Get Start">
              <UInput v-model="state.game.api.start" />
            </UFormGroup>

            <UFormGroup label="API Get Server">
              <UInput v-model="state.game.api.server" />
            </UFormGroup>

            <UFormGroup label="API Get Role">
              <UInput v-model="state.game.api.role" />
            </UFormGroup>

            <UFormGroup label="API Get All Role">
              <UInput v-model="state.game.api.roles" />
            </UFormGroup>

            <UFormGroup label="API Rank Level">
              <UInput v-model="state.game.api.rank_level" />
            </UFormGroup>

            <UFormGroup label="API Rank Power">
              <UInput v-model="state.game.api.rank_power" />
            </UFormGroup>

            <UFormGroup label="API Send Mail">
              <UInput v-model="state.game.api.mail" />
            </UFormGroup>

            <UFormGroup label="API Send Recharge">
              <UInput v-model="state.game.api.recharge" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('game')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <!-- <template #google>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.google.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.google.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Verify">
              <UInput v-model="state.google.client_verify" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #facebook>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.facebook.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.facebook.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Version">
              <UInput v-model="state.facebook.client_version" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #zalo>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.zalo.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.zalo.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Verify">
              <UInput v-model="state.zalo.client_verify" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #tiktok>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.tiktok.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.tiktok.client_secret" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template> -->
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',
  makeby: '',

  // about: '',
  // privacy: '',
  // terms: '',

  contact: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },

  social: {
    facebook: '',
    messenger: '',
    telegram: '',
    zalo: '',
    tiktok: '',
    youtube: '',
  },

  game: {
    image: '',
    secret: '',
    landing: '',
    api: {
      start: '',
      server: '',
      role: '',
      roles: '',
      rank_level: '',
      rank_power: '',
      mail: '',
      recharge: '',
      os: ''
    }
  },

  // google: {
  //   client_id: '',
  //   client_secret: '',
  //   client_verify: '',
  // },

  // facebook: {
  //   client_id: '',
  //   client_secret: '',
  //   client_version: ''
  // },

  // zalo: {
  //   client_id: '',
  //   client_secret: '',
  //   client_verify: '',
  // },

  // tiktok: {
  //   client_id: '',
  //   client_secret: '',
  // }
})

const menu = [
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
// {
//   label: 'Bài giới thiệu',
//   slot: 'about'
// },
// {
//   label: 'Điều khoản dịch vụ',
//   slot: 'terms'
// },
// {
//   label: 'Chính sách quyền riêng tư',
//   slot: 'privacy'
// },
{
  label: 'Trò chơi',
  slot: 'game'
},
// {
//   label: 'API Google',
//   slot: 'google'
// },{
//   label: 'API Facebook',
//   slot: 'facebook'
// },{
//   label: 'API Zalo',
//   slot: 'zalo'
// },{
//   label: 'API Tiktok',
//   slot: 'tiktok'
// }
]

const getConfig = async () => {
  const config = await useAPI('config/admin/get')
  state.value = config
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

getConfig()
</script>