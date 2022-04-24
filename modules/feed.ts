import { getAllProposalsForSpaces } from '../connectors/snapshot'

import { getExplanation } from '../modules/explanation'

import db from '../db'

const findDaoBySpace = (space: string) => db.daos.find(dao => dao.space === space) || null

type TFeedResponse = {
  title: string
  daoTitle: string
  icon: string
  description: {
    short: string
    long: string
  }
  start: number
  end: number
  author: string
  scores: {
    title: string
    votingPower: number
    share: number
  }[]
  votes: number
}[]
export const getFeed = async (): Promise<TFeedResponse> => {
  const daoSpaces = db.daos.map(dao => dao.space)
  const proposals = await getAllProposalsForSpaces(daoSpaces)

  return Promise.all(
    proposals.map(async proposal => {
      const dao = findDaoBySpace(proposal.space.id)
      const totalVotingPower = proposal.scores.reduce((acc, val) => acc += val, 0)
      const ID = `${proposal.space}:${proposal.id}`
      const explanation = await getExplanation(ID)

      return {
        title: proposal.title,
        daoTitle: dao && dao.title || '',
        icon: dao && dao.icon || '',
        description: {
          short: explanation || '',
          long: proposal.body,
        },
        start: proposal.start,
        end: proposal.end,
        author: proposal.author,
        scores: proposal.choices.map((title, idx) => ({
          title,
          votingPower: proposal.scores[idx],
          share: proposal.scores[idx] / totalVotingPower
        })),
        votes: proposal.votes
      }
    })
  )
}
