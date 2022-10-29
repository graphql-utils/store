import { Store } from '../src'
import { Post, schema, TypesMap, User } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { Document } from '../src/types'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can delete an entire document', () => {
  const user = userFactory()
  store.create('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)

  store.clear('User')

  expect(() => store.findFirstOrThrow('User')).toThrowError(
    'Document not found.',
  )
})

it('should not delete irelevant documents', () => {
  store.create('User', userFactory()) as Document<User>
  const post = store.create('Post', postFactory()) as Document<Post>

  store.clear('User')

  expect(() => store.findFirstOrThrow('User')).toThrowError(
    'Document not found.',
  )

  expect(store.findFirstOrThrow('Post')).toEqual(post)
})

it('should not delete the relations', () => {
  const data = userFactory()
  const user = store.create('User', data)

  expect(store.findFirstOrThrow('UserProfile')).toEqual(user.profile)

  store.clear('User')

  expect(() => store.findFirstOrThrow('User')).toThrowError(
    'Document not found.',
  )

  expect(store.findFirstOrThrow('UserProfile')).toEqual(user.profile)
})
