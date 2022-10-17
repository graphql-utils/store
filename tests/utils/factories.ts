import { randUuid, randText, randUserName, randParagraph } from '@ngneat/falso'
import { Post, User } from '../fixtures/schema.types'

export function postFactory(overrides?: Partial<Post>): Post {
  return {
    id: randUuid(),
    title: randText({ charCount: 40 }),
    body: randParagraph(),
    ...overrides,
  }
}

export function userFactory(overrides?: Partial<User>): User {
  return {
    id: randUuid(),
    username: randUserName(),
    posts: [],
    ...overrides,
  }
}
