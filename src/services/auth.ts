
import Auth, { IAuth } from '../model/auth.model'
import { Context } from 'koa'

export default class AuthService {
  /**
   * 通过名字查询一个用户
   * @param ctx
   */
  public static async login (data: IAuth): Promise<IAuth | null> {
    const { username, password } = data
    // 查找用户信息
    const auth = (await Auth
                  .findOne({ username })) as IAuth | null
    return auth
  }
  /**
   * 获取用户信息
   * @param ctx
   */
  public static async getUserInfo (ctx: Context): Promise<IAuth | null> {
    const auth = await Auth
    .findOne({}, 'username gravatar')
    .catch(err => ctx.throw(500, '服务器内部错误'))
    return auth
  }
}
