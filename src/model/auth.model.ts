// 用户数据模型
import * as crypto from 'crypto'
import { Document } from 'mongoose'

import { db } from '../mongodb'
import * as config from '../config'

export interface IAuth extends Document {
  username: string,
  password: string,
  gravatar: string
}

const authSchema = new db.Schema({
  username: {
    type: String,
    default: config.AUTH.defaultUsername
  },
  password: {
    type: String,
    default: crypto.createHash('md5').update(config.AUTH.defaultPassword).digest('hex') // md5加密，初始默认密码
  },
  gravatar: {
    type: String,
    default: ''
  }
})

const Auth = db.model('Auth', authSchema)

export default Auth
