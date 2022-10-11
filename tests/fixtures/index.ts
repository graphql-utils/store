import { Post, User } from './schema.types'

import schema from './schema.graphql'
export { schema }

export interface TypesMap {
  User: User
  Post: Post
}
