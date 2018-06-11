import Article, { IArticle } from '../model/article.model'
import { Context } from 'koa'

export default class ArticleService {
  public static async postArt (ctx: Context) {
    const article = new Article(ctx.request.body)
                      .save()
                      .catch(err => ctx.throw(500, '服务器内部错误'))
    return article
  }
}
