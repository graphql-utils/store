import { Store } from '../src'
import { Post, schema, TypesMap, User } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { Document } from '../src/types'
import { toCollection } from './utils'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should delete all documents in a collection', () => {
  toCollection(() => store.create('User', userFactory()), 5)
  expect(store.count('User')).toEqual(5)

  store.clear('User')
  expect(store.count('User')).toEqual(0)
})

it('should not affect other collections', () => {
  toCollection(() => store.create('User', userFactory()), 5)
  toCollection(() => store.create('Post', postFactory()), 5)

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(5)
})

it('should not delete relative documents', () => {
  store.create(
    'User',
    userFactory({
      posts: toCollection(postFactory, 3),
    }),
  )

  expect(store.count('User')).toEqual(1)
  expect(store.count('Post')).toEqual(3)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(3)
})

it('should delete multiple documents', () => {
  store.create('User', userFactory()) as Document<User>
  store.create('Post', postFactory()) as Document<Post>

  store.clear('User', 'Post')

  expect(store.count('User')).toEqual(0)

  expect(store.count('Post')).toEqual(0)
})

it('should not delete the relations when clearing multiple documents', () => {
  store.create('Post', postFactory()) as Document<Post>
  store.create('User', userFactory()) as Document<User>

  expect(store.count('UserProfile')).toEqual(1)
  expect(store.count('User')).toEqual(1)
  expect(store.count('Post')).toEqual(1)

  store.clear('User', 'Post')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(0)

  expect(store.count('UserProfile')).toEqual(1)
})
