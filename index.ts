// Config
import config from './config'

// Utils
import { logger } from './utils/logger'

// Connectors
import redis from './connectors/Redis'

// Services
import scrapper from './services/scrapper'
import apiServer from './services/api'

const log = logger('main')

const dependencies: Promise<any>[] = [
  // Redis
  redis.connect(config.connectors.redis.host, config.connectors.redis.port),
]

const startServer = async () => {
  log.info('Starting server')
    
  let microservice = apiServer

  await microservice.start()
  log.info('Microservices started')

  // Scrapper
  scrapper()

  process.on('SIGTERM', async () => {
    log.info('Shutting down Microservice')

    await microservice.stop()

    // Redis
    await redis.disconnect()

    log.info('Microservices were successfully shutdown')
  })
}

try {
  Promise.all(dependencies)
    .then(startServer)
} catch (e) {
  log.error(e)
  process.exit(1)
}
