import Article, { IArticle } from '../model/article.model'
import { handleSuccess, handleError } from '../utils/handle'

import { Context } from 'koa'
import ArticleService from '../services/article'

export default class ArticleController {
  public static async postArt (ctx: Context) {
    const article = await ArticleService.postArt(ctx)
    article ? handleSuccess({ ctx, message: '添加文章成功' }) : handleError({ ctx, message: '添加文章成功' })
  }
}
