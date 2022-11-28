import { Store } from '../src'
import { Post, schema, TypesMap, User } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { Document } from '../src/types'
import { getDocumentKey, getDocumentType } from '../src/document'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can add a new document to the store', () => {
  const user = userFactory()
  store.add('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)
})

it('should store document meta data on added document', () => {
  const user = store.add('User', userFactory()) as Document<User>

  expect(getDocumentKey(user)).toEqual(expect.any(String))
  expect(getDocumentType(user)).toEqual('User')

  const post = store.add('Post', postFactory()) as Document<Post>

  expect(getDocumentKey(post)).toEqual(expect.any(String))
  expect(getDocumentType(post)).toEqual('Post')
})

it('should store document meta data privately', () => {
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

  const user = store.add('User', data)

  expect(user).toEqual(data)
  expect(user).toMatchInlineSnapshot(`
    {
      "email": "john.doe@example.com",
      "id": "7c280f0a-c1e7-4982-a008-99d9e1bcbea0",
      "profile": {
        "avatar": {
          "height": 680,
          "size": "226kb",
          "url": "https://example.com/avatar.png",
          "width": 970,
        },
        "bio": "Excepturz.",
        "followers": {
          "count": 0,
          "edges": [],
          "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
          },
        },
        "following": {
          "count": 0,
          "edges": [],
          "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
          },
        },
        "joinedAt": "2022-11-08T15:34:44.339Z",
        "posts": {
          "count": 0,
          "edges": [],
          "pageInfo": {
            "hasNextPage": false,
            "hasPreviousPage": false,
          },
        },
        "username": "john.doe",
      },
      "username": "john.doe",
    }
  `)

  // @ts-expect-error DOCUMENT_KEY_SYMBOL should be hidden from return type
  expect(getDocumentKey(user)).toEqual(expect.any(String))
  // @ts-expect-error DOCUMENT_KEY_SYMBOL should be hidden from return type
  expect(getDocumentType(user)).toEqual('User')
})
