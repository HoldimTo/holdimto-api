import express from 'express'

// Utils
import { logger } from '../../../../../utils/logger'
import { ApiErrorCodes } from '../../../../../utils/errors'

import { getFeed } from '../../../../../modules/feed'

const log = logger('v1-feed-root')
const _router = express.Router({ mergeParams: true })

_router.get(
  '/',
  async (req, res, next): Promise<void> => {
    try {
      const result = await getFeed()
      res.send(result)
    } catch (e) {
      log.error(e)
      res.status(ApiErrorCodes.INTERNAL_ERROR).send()
    }
  }
)

export default _router
