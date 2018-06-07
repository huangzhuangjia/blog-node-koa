import Router = require('koa-router')
import * as config from '../config'
import * as controller from '../controller'

const router = new Router({
  prefix: config.APP.ROOT_PATH
})

router
  .get('/', (ctx, next) => {
    ctx.response.body = config.INFO
  })
  .post('/login', controller.auth.login)
  .get('/getUserInfo', controller.auth.userInfo)

export default router
