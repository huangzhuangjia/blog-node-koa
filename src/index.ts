import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import * as helmet from 'koa-helmet'
import * as logger from 'koa-logger'

import * as config from './config'
import router from './route'

import * as mongodb from './mongodb'

import interceptor from './middleWares/interceptor'
import initAdmin from './middleWares/initAdmin'

const app = new Koa()

// 连接数据库
mongodb.connect()
// 访问日志打印
app.use(logger())
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date().getDate() - start.getDate()
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })
// 拦截器
app.use(interceptor)
// 初始化管理员
app.use(initAdmin)
// 增强安全性,如防止xss攻击，阻止点击劫持
app.use(helmet())
// 处理post请求文件上传表单提交，解析到ctx.request.body
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
    console.log(error)
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
