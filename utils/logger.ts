import config, { Environment } from '../config'

export const logger = (name: string) => {
  const info = (...args: any[]) => console.info(`INFO [${name}]`, ...args)
  const debug = (...args: any[]) => console.log(`DEBUG [${name}]`, ...args)
  const error = (...args: any[]) => console.error(`ERROR [${name}]`, ...args)

  return {
    info,
    error,
    debug: config.app.environment === Environment.DEVELOPMENT ? debug : () => {}
  }
}
