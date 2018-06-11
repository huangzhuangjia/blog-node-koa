
import authIsVerified from '../utils/auth'
import { AllowedOrigins } from '../config'

import { Context } from "koa"

export default async (ctx: Context, next: () => Promise<any>) => {

  // 拦截器
  // 设置跨域资源共享请求CORS
  const allowedOrigins: any[] = AllowedOrigins
  const origin = ctx.request.headers.origin || ''
  if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
    ctx.set('Access-Control-Allow-Origin', origin)
  }
  ctx.set({
    'Access-Control-Allow-Headers': 'Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With',
    'Access-Control-Allow-Methods': 'PUT,PATCH,POST,GET,DELETE,OPTIONS',
    'Access-Control-Max-Age': '1728000',
    'Content-Type': 'application/jsoncharset=utf-8',
    'X-Powered-By': 'my_blog 1.0.0'
  })

  // OPTIONS
  if (ctx.request.method === 'OPTIONS') {
    ctx.status = 200
    return false
  }

  // 如果是生产环境，需要验证用户来源渠道，防止非正常请求
  if (Object.is(process.env.NODE_ENV, 'production')) {
    const { origin, referer } = ctx.request.headers
    if (origin !== 'file://') {
      const originVerified = (!origin || origin.includes('')) &&
                            (!referer || referer.includes(''))
      if (!originVerified) {
        ctx.throw(403, { code: 0, message: '身份验证失败！' })
        return false
      }
    }
  }

  // 排除auth的post请求 && 评论的post请求 && like post请求 && hero post
  // const isLike = Object.is(ctx.request.url, '/api/like') && Object.is(ctx.request.method, 'POST')
  // const isPostAuth = Object.is(ctx.request.url, '/api/auth') && Object.is(ctx.request.method, 'POST')
  const isLogin = Object.is(ctx.request.url, '/api/login') && Object.is(ctx.request.method, 'POST')
  // const isHero = Object.is(ctx.request.url, '/api/hero') && Object.is(ctx.request.method, 'POST')
  // const isPostComment = Object.is(ctx.request.url, '/api/comment') && Object.is(ctx.request.method, 'POST')
  if (isLogin) {
    await next()
    return false
  }
  // 验证用户
  if (!authIsVerified(ctx)) {
    ctx.throw(401, { code: -2, message: '身份验证失败！' })
    return false
  }

  await next()
}
