import { Server } from 'net'
import httpShutdown from 'http-shutdown'

export interface IServerWithShutdown extends Server {
  shutdown(cb: (err?: Error) => any): void
  forceShutdown(cb: (err?: Error) => any): void
}

export const httpWithShutdown = httpShutdown
