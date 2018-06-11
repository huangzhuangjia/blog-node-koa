// 文章数据模型

import { db } from '../mongodb'
import { Document, Schema } from 'mongoose'
import * as paginate from 'mongoose-paginate'
import * as autoIncrement from 'mongoose-auto-increment'

export interface IArticle extends Document {
  // 标题
  title: string,
  // 内容
  content: string
  // 发布日期
  create_at: Date
  // 最后修改日期
  update_at: Date
}

const ArticleSchema: Schema = new db.Schema({
  // 标题
  title: {
    type: String,
    required: true
  },
  // 内容
  content: {
    type: String,
    required: true
  },
  // 发布日期
  create_at: {
    type: Date,
    default: Date.now
  },
  // 最后修改日期
  update_at: {
    type: Date,
    default: Date.now
  }
})
// 转化成普通 JavaScript 对象
ArticleSchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
ArticleSchema.plugin(paginate)
ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})
// 时间更新
ArticleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_at: Date.now() })
  next()
})

const ArticleModel = db.model('Article', ArticleSchema)

export default ArticleModel
