import { ethers } from 'ethers'

import db from '../db'

import { getPortfolioByAddress, TAssetsResponse } from '../connectors/zerion'

const MERGE_ADDRESSES_FOR_HACKATHON = [
  '0x2b30927c2dfa2aafb6b8980b5b193f4bcc203d24', // 1inch holder
  '0x5d0ac389c669d6efe3ba96b9878d8156f180c539', // Opium holder
  '0xe921c6a0ee46685f8d7fc47272acc4a39cadee8f', // Gelato holder
  '0xb7069e5abd70f56950298f8020d55cf91546ce50', // AAVE holder
  '0x6b3a3c5eca47c993ea184bb629741fbf09670d83', // Gearbox holder
  '0x5201438a10c44f49b71425bd24ee1a4aedcc3284', // The Graph holder
]

const findDaoByToken = (token: string) => db.daos.find(dao => dao.token.toLowerCase() === token.toLowerCase()) || null

type TPortfolioResponse = {
  title: string
  symbol: string
  icon: string
  amount: number
  share: number
}[]
export const getDaoPortfolioByAddress = async (): Promise<TPortfolioResponse> => {
  const response: TPortfolioResponse = []
  const responsesArray = await Promise.all(
    MERGE_ADDRESSES_FOR_HACKATHON
      .map(async (address: string) => getPortfolioByAddress(address.toLowerCase()))
  )
  const assets: TAssetsResponse = responsesArray.reduce((acc, response) => acc = { ...acc, ...response.payload.assets }, {})
  for (const asset in assets) {
    const dao = findDaoByToken(asset)
    if (!dao) {
      continue
    }

    const assetData = assets[asset]

    const amount = +ethers.utils.formatUnits(assetData.quantity, assetData.asset.decimals)

    response.push({
      title: dao.title,
      symbol: assetData.asset.symbol,
      icon: dao.icon,
      amount,
      share: amount / dao.totalSupply
    })
  }
  return response
}
