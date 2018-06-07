import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import * as helmet from 'koa-helmet'

import * as config from './config'
import router from './route'

import * as mongodb from './mongodb'

import interceptor from './middleWares/interceptor'
import initAdmin from './middleWares/initAdmin'

const app = new Koa()

// 连接数据库
mongodb.connect()

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date().getDate() - start.getDate()
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// middleware
app.use(interceptor)
app.use(initAdmin)

app.use(helmet())
// 处理文件上传
app.use(koaBody({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}))
// 404 500
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.body = { code: 0, message: '服务器内部错误' }
  }
  if (ctx.status === 404 || ctx.status === 405) ctx.body = { code: 0, message: '无效的api请求'}
})

app
  .use(router.routes())
  .use(router.allowedMethods()) // 丰富response头部信息

app.listen(config.APP.PORT, () => {
  console.log(`Server has Run！port at ${config.APP.PORT}`)
})
