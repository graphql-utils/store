import { createStore } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { postFactory, userFactory, profileFactory } from '../../utils/factories'
import { toCollection } from '../../utils'

const store = createStore<TypesMap>({
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
  toCollection(
    () => store.add('Post', postFactory({ author: userFactory() })),
    5,
  )

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(5)
})

it('should not delete relative documents', () => {
  store.add('User', userFactory({ profile: profileFactory() }))

  expect(store.count('User')).toEqual(1)
  expect(store.count('Profile')).toEqual(1)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Profile')).toEqual(1)
})

it('can clear multiple collections', () => {
  store.add('Post', postFactory())
  store.add('User', userFactory())

  expect(store.count('Post')).toEqual(1)
  expect(store.count('User')).toEqual(2)
  expect(store.count('Profile')).toEqual(2)

  store.clear('User', 'Post', 'Profile')

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(0)
  expect(store.count('Profile')).toEqual(0)
})
