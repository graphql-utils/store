import { Store } from '../../src'
import { isDocument } from '../../src/document'
import { User, schema, TypesMap } from '../fixtures'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should return `true` if the input is document', () => {
  const data: User = {
    id: '7c280f0a-c1e7-4982-a008-99d9e1bcbea0',
    username: 'john.doe',
    email: 'john.doe@example.com',
    profile: {
      username: 'john.doe',
      bio: 'Excepturz.',
      avatar: {
        url: 'https://example.com/avatar.png',
        height: 680,
        width: 970,
        size: '226kb',
      },
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
      joinedAt: '2022-11-08T15:34:44.339Z',
    },
  }

  store.add('User', data)
  const user = store.findFirst('User')

  expect(isDocument(user)).toEqual(true)
})

it('should return `false` if the input is not a document', () => {
  const data: User = {
    id: '7c280f0a-c1e7-4982-a008-99d9e1bcbea0',
    username: 'john.doe',
    email: 'john.doe@example.com',
    profile: {
      username: 'john.doe',
      bio: 'Excepturz.',
      avatar: {
        url: 'https://example.com/avatar.png',
        height: 680,
        width: 970,
        size: '226kb',
      },
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
      joinedAt: '2022-11-08T15:34:44.339Z',
    },
  }

  expect(isDocument(data)).toEqual(false)
})
