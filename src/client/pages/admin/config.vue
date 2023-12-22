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
  logo_long_image: '',
  makeby: '',

  download: {
    apk: '',
    ios: '',
  },

  contact: {
    name: '',
    phone: '',
    email: '',
    address: ''
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: ''
  },

  game: {
    image: '',
    secret: '',
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
  }
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
{
  label: 'Trò chơi',
  slot: 'game'
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

getConfig()
</script>