import { randUuid, randUserName } from '@ngneat/falso'
import { User } from '../fixtures/schema.types'

export function userFactory(overrides?: Partial<User>): User {
  return {
    id: randUuid(),
    username: randUserName(),
    posts: [],
    ...overrides,
  }
}
