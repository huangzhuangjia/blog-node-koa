import crypto = require('crypto')
import jwt = require('jsonwebtoken')
import { Context } from 'koa'

import * as config from '../config'
import { handleSuccess, IParams, handleError } from '../utils/handle'

import Auth, { IAuth } from '../model/auth.model'

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
    const { username, password } = ctx.request.body
    console.log(ctx.request.body)
    // 查找用户信息
    console.log(Auth)
    const auth = (await Auth
                  .findOne({ username })) as IAuth | null
    if (auth) {
      if (auth.password === md5Decode(password)) {
        const token = jwt.sign({ // 用户信息签名加密生成token
          username: auth.username,
          password: auth.password,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
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
    const auth = await Auth
                      .findOne({}, 'name username slogan gravatar')
                      .catch(err => ctx.throw(500, '服务器内部错误'))
    if (auth) {
      handleSuccess({ ctx, result: auth, message: '获取用户资料成功' })
    } else handleError({ ctx, message: "获取用户资料失败" })
  }
}
