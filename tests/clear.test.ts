import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { postFactory, userFactory, userProfileFactory } from './utils/factories'
import { toCollection } from './utils'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should delete all documents in a collection', () => {
  toCollection(() => store.add('User', userFactory()), 5)
  expect(store.count('User')).toEqual(5)

  store.clear('User')
  expect(store.count('User')).toEqual(0)
})

it('should not affect other collections', () => {
  toCollection(() => store.add('User', userFactory()), 5)
  toCollection(() => store.add('Post', postFactory()), 5)

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(5)
})

it('should not delete relative documents', () => {
  store.add(
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

it('can clear multiple collections', () => {
  store.add(
    'User',
    userFactory({
      profile: userProfileFactory(),
      posts: toCollection(postFactory, 3),
    }),
  )

  expect(store.count('User')).toEqual(1)
  expect(store.count('Post')).toEqual(3)
  expect(store.count('UserProfile')).toEqual(1)

  store.clear('User', 'Post', 'UserProfile')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(0)
  expect(store.count('UserProfile')).toEqual(0)
})
