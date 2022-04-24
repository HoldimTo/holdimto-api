import axios from 'axios'

const client = axios.create({
  baseURL: 'https://hub.snapshot.org/graphql',
  maxRedirects: 0,
  validateStatus(status: number){
    return status >= 200 && status <= 302
  },
})

const LIMIT = 10

type TProposalsResponse = {
  id: string
  space: {
    id: string
  }
  title: string
  body: string
  choices: string[]
  start: number
  end: number
  state: string
  author: string
  scores: number[]
  votes: number
}[]
export const getAllProposalsForSpaces = async (spaces: string[]): Promise<TProposalsResponse> => {
  const response = await client.post('', {
    query: `
      query Proposals {
        proposals(
          first: ${LIMIT},
          skip: 0,
          where: {
            space_in: ["${spaces.join('","')}"],
          },
          orderBy: "created",
          orderDirection: desc
        ) {
          id
          space {
            id
          }
          title
          body
          choices
          start
          end
          state
          author
          scores
          votes
        }
      }
    `
  })

  return response.data.data.proposals
}
