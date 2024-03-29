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
  menu: {
    action: {
      payment: boolean
      withdraw: boolean
      giftcode: boolean
    }
    shop: {
      pack: boolean
      item: boolean
      currency: boolean
    }
    event: {
      login: boolean
      pay: boolean
      spend: boolean
    }
    minigame: {
      wheel: boolean
      dice: boolean
    }
    rank: {
      level: boolean
      power: boolean
    }
    social: {
      facebook: boolean
      group: boolean
    }
  }
  enable: {
    signin: boolean
    signup: boolean
    play: boolean
    referral: boolean
    landing: boolean
  }
  homepage: {
    landing: Types.ObjectId
  }
  download: {
    apk: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
  }
  game: {
    mobile: boolean
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
  }
  facebook: {
    client_id: string
    client_secret: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_secret: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_secret: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_secret: string
    client_verify: string
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
  enable: {
    signin: boolean
    signup: boolean
    play: boolean
    referral: boolean
    landing: boolean
  }
  download: {
    apk: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
  }
  game: {
    mobile: boolean
    image: string
    landing: string
  }
  facebook: {
    client_id: string
    client_version: string
    client_verify: string
  }
  google: {
    client_id: string
    client_verify: string
  }
  tiktok: {
    client_id: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_verify: string
  }
}