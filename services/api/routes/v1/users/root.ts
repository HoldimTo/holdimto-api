import express from 'express'

// Utils
import { logger } from '../../../../../utils/logger'
import { ApiErrorCodes } from '../../../../../utils/errors'

import { getDaoPortfolioByAddress } from '../../../../../modules/portfolio'

const log = logger('v1-users-root')
const _router = express.Router({ mergeParams: true })

_router.get(
  '/me',
  async (req, res, next): Promise<void> => {
    try {
      const result = await getDaoPortfolioByAddress()
      res.send(result)
    } catch (e) {
      log.error(e)
      res.status(ApiErrorCodes.INTERNAL_ERROR).send()
    }
  }
)

export default _router
