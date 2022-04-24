import { Configuration, OpenAIApi } from 'openai'

import config from '../config'

const configuration = new Configuration({
  apiKey: config.connectors.openai.apiKey
})

const openai = new OpenAIApi(configuration)

const ENGINE_ID_COMPLETION = 'text-davinci-002'
const ENGINE_ID_EDIT = 'text-davinci-edit-001'

export const completeText = async (text: string) => {
  const response = await openai.createCompletion(ENGINE_ID_COMPLETION, {
    prompt: text,
    max_tokens: 280,
    temperature: 0.5
  })
  return response.data.choices && response.data.choices[0].text || ''
}

export const editText = async (input: string, instruction: string) => {
  const response = await openai.createEdit(ENGINE_ID_EDIT, {
    input,
    instruction,
    temperature: 0.5
  })
  return response.data.choices && response.data.choices[0].text || ''
}