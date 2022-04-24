import * as redis from 'redis'
import { promisify } from 'util'

// Utils
import { logger } from '../utils/logger'

class Redis {
  private _client: undefined|redis.RedisClient
  private _getAsync: undefined|((key: string) => Promise<string>)
  private _setexAsync: undefined|((key: string, seconds: number, value: string) => Promise<string>)
  private _setAsync: undefined|((key: string, value: string) => Promise<unknown>)
  private _keysAsync: undefined|((pattern: string) => Promise<string[]>)
  private _log = logger('Redis')

  public connect(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._client = redis.createClient({
        host,
        port,
      })

      if (!this._client) {
        return reject(new Error('Client has not been created'))
      }

      this._getAsync = promisify(this._client.get).bind(this._client)
      this._setexAsync = promisify(this._client.setex).bind(this._client)
      this._setAsync = promisify(this._client.set).bind(this._client)
      this._keysAsync = promisify(this._client.keys).bind(this._client)

      this._client.on('connect', () => {
        this._log.info('Successfully connected to Redis')
        resolve()
      })

      this._client.on('error', (err: InstanceType<typeof Error>) => {
        this._log.error(err, 'Redis error')
      })

    })
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._client) {
        return reject(new Error('Client has not been created'))
      }

      this._client.quit((err: Error) => {
        if (err) {
          return reject(err)
        }
        this._log.info('Successfully disconnected from Redis')
        resolve()
      })
    })
  }

  // Cache
  public async getCache<T>(topic: string): Promise<T | null> {
    if (!this._getAsync) {
      throw new Error('Connect was not called')
    }

    const data = await this._getAsync(topic)

    if (data) {
      this._log.debug('cache hit')
      return JSON.parse(data)
    }

    this._log.debug('cache miss')
    return data as unknown as T
  }

  public async setCache(topic: string, expires: number | null, data: Record<string, unknown>): Promise<unknown> {
    if (!this._setexAsync || !this._setAsync) {
      throw new Error('Connect was not called')
    }

    if (expires) {
      this._log.debug('written with expiration')
      return this._setexAsync(topic, expires, JSON.stringify(data))
    }
    
    this._log.debug('written')
    return this._setAsync(topic, JSON.stringify(data))
  }

  // Keys
  public async keys(pattern: string): Promise<string[]> {
    if (!this._keysAsync) {
      throw new Error('Connect was not called')
    }

    const keys = await this._keysAsync(pattern)
    return keys
  }

  public isConnected(): boolean {
    if (!this._client) {
      return false
    }

    return this._client.connected
  }
}

export default new Redis()
