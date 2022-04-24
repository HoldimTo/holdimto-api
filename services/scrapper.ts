import { getAllProposalsForSpaces } from './../connectors/snapshot'
import { completeText, editText } from './../connectors/openAI'

import { getExplanation, setExplanation } from './../modules/explanation'

import db from '../db'

const SCRAPPING_INTERVAL = 3600 * 1000 // 1h

const printText = (title: string, text: string) => {
  console.log(`====== PRINTING: ${title} ======`)
  console.log(text)
  console.log(`================================`)
}

const fetchExplanation = async (proposalBody: string): Promise<string> => {
  const proposalText = proposalBody
    .replace(/(\r\n|\n|\r)/gm, ' ')
  printText('Initial text', proposalText)
  let resultText = await completeText(`
    ${proposalText}

    Explain text above in two sentences:
  `)
  // const resultText = await editText(
  //   proposalText,
  //   'Explain the text'
  // )
  resultText = resultText
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .trim()
  printText('Result', resultText)
  return resultText
}

const scrapAll = async () => {
  const daoSpaces = db.daos.map(dao => dao.space)
  const proposals = await getAllProposalsForSpaces(daoSpaces)

  await Promise.all(
    proposals.map(async proposal => {
      const ID = `${proposal.space}:${proposal.id}`
      let explanation = await getExplanation(ID)
      if (explanation !== null) {
        return
      }
      
      explanation = await fetchExplanation(proposal.body)
      await setExplanation(ID, explanation)
    })
  )

  // for (const proposal of proposals) {
  //   await fetchExplanation(proposal.body)
  // }
}

export default () => {
  setInterval(scrapAll, SCRAPPING_INTERVAL)
  scrapAll()
}
