import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from '../src/constants'
import { Document } from '../src/types'
import { Post, User } from './fixtures/schema.types'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can create and store a new entity ', () => {
  const user = userFactory()
  store.create('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)
})

it('should store document meta data on created entity', () => {
  const user = store.create('User', userFactory()) as Document<User>

  expect(user[DOCUMENT_KEY]).toEqual(expect.any(String))
  expect(user[DOCUMENT_TYPE]).toEqual('User')

  const post = store.create('Post', postFactory()) as Document<Post>

  expect(post[DOCUMENT_KEY]).toEqual(expect.any(String))
  expect(post[DOCUMENT_TYPE]).toEqual('Post')
})

it('should store document meta data privately', () => {
  const data: User = {
    id: '7c280f0a-c1e7-4982-a008-99d9e1bcbea0',
    username: 'Yhudiyt.Wanjala99',
    posts: [],
  }

  const user = store.create('User', data)

  expect(user).toEqual(data)
  expect(user).toMatchInlineSnapshot(`
    {
      "id": "7c280f0a-c1e7-4982-a008-99d9e1bcbea0",
      "posts": [],
      "username": "Yhudiyt.Wanjala99",
    }
  `)

  // @ts-expect-error DOCUMENT_KEY_SYMBOL should be hidden from return type
  expect(user[DOCUMENT_KEY]).toEqual(expect.any(String))
  // @ts-expect-error DOCUMENT_KEY_SYMBOL should be hidden from return type
  expect(user[DOCUMENT_TYPE]).toEqual('User')
})
