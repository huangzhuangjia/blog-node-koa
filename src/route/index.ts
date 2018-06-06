import Router = require('koa-router')
import * as config from '../config'

const router = new Router({
  prefix: config.APP.ROOT_PATH
})

router
  .get('/', (ctx, next) => {
    ctx.response.body = config.INFO
  })

export default router
