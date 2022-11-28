import type {
  Post,
  User,
  Profile,
  Comment,
  Image,
  Video,
  Tag,
  Text,
} from './schema.types'

import schema from './schema.graphql'
export { schema }

export type { Post, User, Profile, Comment, Text, Image, Video, Tag }

export interface TypesMap {
  User: User
  Post: Post
  Profile: Profile
  Comment: Comment
  Text: Text
  Image: Image
  Video: Video
  Tag: Tag
}
