import express from 'express'

import users from './users'
import feed from './feed'

const _router = express.Router({ mergeParams: true })

_router.use('/users', users)
_router.use('/feed', feed)

export const router = _router
