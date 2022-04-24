import dotenv from 'dotenv'
// MUST BE HERE: To initialize .env variables first
dotenv.config()

export enum Environment {
  DEVELOPMENT = 'development',
  STAGE = 'stage',
  PRODUCTION = 'production'
}

const app = {
  environment: process.env.NODE_ENV || Environment.DEVELOPMENT
}

const api = {
  port: process.env.PORT || 3000
}

const connectors = {
  zerion: {
    apiKey: process.env.ZERION_API_KEY || 'Demo.ukEVQp6L5vfgxcz4sBke7XvS873GMYHy'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || ''
  }
}

export default {
  app,
  api,
  connectors
}
