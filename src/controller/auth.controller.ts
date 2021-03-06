import crypto = require('crypto')
import jwt = require('jsonwebtoken')
import { Context } from 'koa'

import * as config from '../config'
import { handleSuccess, IParams, handleError } from '../utils/handle'

import Auth, { IAuth } from '../model/auth.model'
import AuthService from '../services/auth'

// md5 编码
const md5Decode = (pwd: string | Buffer | DataView) => {
  return crypto
    .createHash("md5")
    .update(pwd)
    .digest("hex")
}

export default class AuthController {
  /**
   * 用户登录
   * @param ctx
   */
  public static async login (ctx: Context) {
    const data = ctx.request.body
    const auth = await AuthService.login(data)
    if (auth) {
      if (auth.password === md5Decode(data.password)) {
        const token = jwt.sign({ // 用户信息签名加密生成token
          username: auth.username,
          password: auth.password,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 设置过期时间
        }, config.AUTH.jwtTokenSecret)
        handleSuccess({ ctx, result: { token, lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) }, message: "登陆成功" })
      } else {
        handleError({ ctx, message: "密码错误!" })
      }
    } else {
      handleError({ ctx, message: "账户不存在" })
    }
  }
  /**
   * 获取用户信息
   * @param ctx
   */
  public static async userInfo (ctx: Context) {
    const auth = await AuthService.getUserInfo(ctx)
    if (auth) {
      handleSuccess({ ctx, result: auth, message: '获取用户资料成功' })
    } else handleError({ ctx, message: "获取用户资料失败" })
  }
  /**
   * 用户退出
   * @param ctx
   */
  public static async logout (ctx: Context) {
    handleSuccess({ ctx, result: null, message: '退出成功' })
  }
}
