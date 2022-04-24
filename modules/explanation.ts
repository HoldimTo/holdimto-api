import redis from '../connectors/Redis'

const getKey = (id: string) => `proposals:${id}:explanation`

export const setExplanation = async (proposalId: string, explanation: string) => {
  const key = getKey(proposalId)
  await redis.setCache(key, null, { explanation })
}

export const getExplanation = async (proposalId: string) => {
  const key = getKey(proposalId)
  const cache = await redis.getCache<{ explanation: string }>(key)
  return cache && cache.explanation || null
}
