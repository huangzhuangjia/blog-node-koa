const argv = require('yargs').argv

export const MONGODB = {
  uri: `mongodb://127.0.0.1:${argv.dbport || '27017'}/my_blog`,
  username: argv.db_username || 'DB_username',
  password: argv.db_password || 'DB_password'
}
export const AUTH = {
  jwtTokenSecret: argv.auth_key || 'my_blog',
  defaultUsername: argv.auth_default_username || 'junga',
  defaultPassword: argv.auth_default_password || '123456'
}
export const APP = {
  ROOT_PATH: '/api',
  LIMIT: 16,
  PORT: 8082
}
export const AllowedOrigins = []
export const INFO = {
  name: 'Junga_blog',
  version: '1.0.0',
  author: 'junga',
  powered: ['Vue2', 'Nuxt.js', 'Node.js', 'MongoDB', 'koa', 'Nginx']
}
