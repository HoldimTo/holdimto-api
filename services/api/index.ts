import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import http from 'http'

import { routes } from './routes'
import config from '../../config'

import { logger } from '../../utils/logger'
import { httpWithShutdown } from '../../utils/http'

const log = logger('api-server')

const app = express()
const server = httpWithShutdown(new http.Server(app))

// App configuration
app.use(cors())
app.use(helmet()) // Secure HTTP Headers
app.set('x-powered-by', false) // Remove powered by header

// Routes
Object.keys(routes).forEach(route => {
  app.use(`/${route}`, routes[route])
})

const start = (): Promise<http.Server> => {
  log.info('Starting Express server')
  return new Promise(resolve => {
    app.listen(config.api.port, () => {
      log.info('Express server listening on port ' + config.api.port)
      resolve(server)
    })
  })
}

const shutdown = (): Promise<void> => {
  log.info('Stopping Express server')

  return new Promise(resolve => {
    if (server) {
      return server.shutdown(() => {
        log.info('Express server stopped')
        resolve()
      })
    }
    resolve()
  })
}

class ApiServerMicroservice {
  private _isReady = false

  public async start() {
    // API Server
    log.info('Starting HTTP server...')
    await start()
    log.info('HTTP server was successfully started')

    this._isReady = true
  }

  public async stop() {
    log.info('Shutting down API service...')

    // Shutdown HTTP server
    await shutdown()

    log.info('API service was successfully shutdown')
  }

  public async isReady(): Promise<boolean> {
    return this._isReady
  }

  public async isLive(): Promise<boolean> {
    return true
  }
}

export default new ApiServerMicroservice()
