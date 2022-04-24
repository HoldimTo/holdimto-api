import io from 'socket.io-client'

import config from '../config'

const BASE_URL = 'wss://api-v4.zerion.io/';

function verify(request: any, response: any) {
  // each value in request payload must be found in response meta
  return Object.keys(request.payload).every(key => {
    const requestValue = request.payload[key]
    const responseMetaValue = response.meta[key]
    if (typeof requestValue === 'object') {
      return JSON.stringify(requestValue) === JSON.stringify(responseMetaValue)
    }
    return responseMetaValue === requestValue
  })
}

const addressSocket = {
  namespace: 'address',
  socket: io(`${BASE_URL}address`, {
    transports: ['websocket'],
    timeout: 60000,
    query: {
      api_token: config.connectors.zerion.apiKey,
    },
  }),
}

function get(socketNamespace: any, requestBody: any) {
  return new Promise<any>(resolve => {
    const { socket, namespace } = socketNamespace
    const handleReceive = (data: any) => {
      if (verify(requestBody, data)) {
        unsubscribe()
        resolve(data)
      }
    }
    const model = requestBody.scope[0]
    const topic = `received ${namespace} ${model}`
    function unsubscribe() {
      socket.off(topic, handleReceive)
      socket.emit('unsubscribe', requestBody)
    }
    socket.emit('get', requestBody)
    socket.on(topic, handleReceive)
  });
}

export type TAssetsResponse = {
  [tokenId: string]: {
    asset: {
      symbol: string
      decimals: number
      icon_url: string
    }
    quantity: string
  }
}
type TPortfolioByAddressResponse = {
  payload: {
    assets: TAssetsResponse
  }
}
// @ts-ignore
export const getPortfolioByAddress = (address: string): Promise<TPortfolioByAddressResponse> => get(addressSocket, {
  scope: ['assets'],
  payload: {
    address,
  },
})
