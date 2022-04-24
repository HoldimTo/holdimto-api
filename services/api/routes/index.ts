import express from 'express'

import { router as routerV1 } from './v1'

const _routes: {[version: string]: express.Router} = {}

_routes['v1'] = routerV1

export const routes = _routes
