import type { Types } from 'mongoose'

export interface IDBConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  logo_long_image: string
  makeby: string
  about: string
  privacy: string
  terms: string
  contact: {
    name: string
    phone: string
    email: string
    address: string
  },
  social: {
    facebook: string
    messenger: string
    telegram: string
    zalo: string
    tiktok: string
    youtube: string
  },
  game: {
    image: string
    secret: string
    landing: string
    api: {
      start: string
      role: string
      roles: string
      server: string
      rank_power: string
      rank_level: string
      mail: string
      recharge: string
      os: string
    }
  },
  google: {
    client_id: string
    client_secret: string
    client_verify: string
  },
  facebook: {
    client_id: string
    client_secret: string
    client_version: string
  },
  zalo: {
    client_id: string
    client_secret: string
    client_verify: string
  },
  tiktok: {
    client_id: string
    client_secret: string
  }
}

export interface IDBConfigStore {
  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  logo_long_image: string
  makeby: string
  contact: {
    name: string
    phone: string
    email: string
    address: string
  }
  social: {
    facebook: string
    messenger: string
    telegram: string
    zalo: string
    tiktok: string
    youtube: string
  }
  game: {
    image: string
    landing: string
  }
  google: {
    client_id: string
    client_verify: string
  }
  facebook: {
    client_id: string
    client_version: string
  }
  zalo: {
    client_id: string
    client_verify: string
  }
  tiktok: {
    client_id: string
  }
}