import type {
  Post,
  User,
  Profile,
  Comment,
  Image,
  Video,
  Text,
} from './schema.types'

import schema from './schema.graphql'
export { schema }

export type { Post, User, Profile, Comment, Text, Image, Video }

export interface TypesMap {
  User: User
  Post: Post
  Profile: Profile
  Comment: Comment
  Text: Text
  Image: Image
  Video: Video
}
