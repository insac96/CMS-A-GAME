import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  const config : IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    og_image: '',
    makeby: '',
    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
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
    },
    google: {
      client_id: '',
      client_verify: '',
    },
    facebook: {
      client_id: '',
      client_version: '',
    },
    zalo: {
      client_id: '',
      client_verify: '',
    },
    tiktok: {
      client_id: '',
    }
  })

  const bootConfig = async () => {
    const cfg : IDBConfigStore = await useAPI('config/get')
    Object.assign(config, cfg)
  }

  return { config, bootConfig }
})