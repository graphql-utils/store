import { Post, User, UserProfile } from './schema.types'

import schema from './schema.graphql'
export { schema }

export type { Post, User, UserProfile }

export interface TypesMap {
  User: User
  Post: Post
  UserProfile: UserProfile
}
