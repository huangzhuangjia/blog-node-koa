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
  .post('/login', controller.auth.login)                      // 用户登录
  .get('/getUserInfo', controller.auth.userInfo)              // 获取用户信息
  .get('/logout', controller.auth.logout)                     // 用户登出
   // 文章
  .post('/article', controller.article.postArt)

export default router
