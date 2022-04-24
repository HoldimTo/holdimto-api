import express from 'express'

import root from './root'

const router = express.Router({ mergeParams: true })

router.use(root)

export default router
