/* auth验证方法 */

import jwt = require('jsonwebtoken')
import { Context } from 'koa'

import config = require('../config')

// 验证Auth
const authToken = (ctx: Context) => {
  if (ctx.request.headers && ctx.request.headers.authorization) {
    const parts = ctx.request.headers.authorization.split(' ')
    if (Object.is(parts.length, 2) && Object.is(parts[0], 'Bearer')) {
      return parts[1]
    }
  }
  return false
}

// 验证权限
const authIsVerified = (ctx: Context) => {
  const token = authToken(ctx)
  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.AUTH.jwtTokenSecret)
      // @ts-ignore
      if (decodedToken.exp > Math.floor(Date.now() / 1000)) {
        return true
      }
    } catch (err) {
      console.log(err)
    }
  }
  return false
}

export default authIsVerified
