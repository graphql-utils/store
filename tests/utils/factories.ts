import { Post, User, UserProfile } from '../fixtures'
import {
  randUuid,
  randText,
  randUserName,
  randParagraph,
  randFullName,
  randUrl,
} from '@ngneat/falso'

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
    profile: userProfileFactory(),
    posts: [],
    ...overrides,
  }
}

export function userProfileFactory(
  overrides?: Partial<UserProfile>,
): UserProfile {
  return {
    fullName: randFullName(),
    github: randUserName(),
    twitter: randUserName(),
    website: randUrl(),
    ...overrides,
  }
}
