import {
  Comment,
  Post,
  User,
  Profile,
  Image,
  Text,
  Video,
  Tag,
} from '../fixtures'
import {
  randUuid,
  randText,
  randUserName,
  randEmail,
  randUrl,
  randNumber,
  rand,
} from '@ngneat/falso'

export function postFactory(overrides?: Partial<Post>): Post {
  return {
    id: randUuid(),
    author: userFactory(),
    comments: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    likes: 0,
    likedBy: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    tags: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    content: rand([imageFactory, videoFactory, textFactory])(),
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function userFactory(overrides?: Partial<User>): User {
  return {
    id: randUuid(),
    username: randUserName(),
    email: randEmail(),
    profile: profileFactory(),
    ...overrides,
  }
}

export function profileFactory(overrides?: Partial<Profile>): Profile {
  return {
    username: randUserName(),
    bio: randText(),
    avatar: imageFactory(),
    followers: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    following: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    posts: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    joinedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function commentFactory(overrides?: Partial<Comment>): Comment {
  return {
    id: randUuid(),
    author: userFactory(),
    text: randText(),
    createdAt: new Date().toString(),
    ...overrides,
  }
}

export function tagFactory(overrides?: Partial<Tag>): Tag {
  return {
    id: randUuid(),
    name: randText(),
    posts: {
      count: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    createAt: new Date().toISOString(),
    ...overrides,
  }
}

export function imageFactory(overrides?: Partial<Image>): Image {
  return {
    url: randUrl(),
    caption: randText(),
    height: randNumber({ min: 100, max: 1024 }),
    width: randNumber({ min: 100, max: 1024 }),
    size: `${randNumber({ min: 100, max: 1024 })}kb`,
    ...overrides,
  }
}

function videoFactory(overrides?: Partial<Video>): Video {
  return {
    url: randUrl(),
    caption: randText(),
    duration: randNumber({ min: 10, max: 100 }),
    mimeType: rand(['video/mp4', 'video/avi', 'video/mkv', 'video/webm']),
    ...overrides,
  }
}

function textFactory(overrides?: Partial<Text>): Text {
  return {
    text: randText(),
    ...overrides,
  }
}
