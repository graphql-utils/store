import { createStore } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { postFactory, userFactory } from '../../utils/factories'
import { toCollection } from '../../utils'

const store = createStore<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should delete single documents in a collection', () => {
  toCollection(() => store.add('User', userFactory()), 5)
  const user = store.findFirstOrThrow('User')
  expect(store.count('User')).toEqual(5)

  store.delete(user)

  expect(store.count('User')).toEqual(4)
  expect(
    store.find('User', (data) => {
      return data.username.startsWith(user.username)
    }),
  ).toEqual([])
})

it('should not affect other collections', () => {
  toCollection(() => store.add('Post', postFactory()), 5)
  toCollection(() => store.add('User', userFactory()), 5)
  const user = store.findFirstOrThrow('User')

  expect(store.count('Post')).toEqual(5)
  expect(store.count('User')).toEqual(10)
  expect(store.count('Profile')).toEqual(10)

  store.delete(user)

  expect(store.count('User')).toEqual(9)
  expect(store.count('Post')).toEqual(5)
  expect(store.count('Profile')).toEqual(10)
  expect(
    store.find('User', (data) => {
      return data.username.startsWith(user.username)
    }),
  ).toEqual([])
})

it('should throw error if input document is not valid', () => {
  const data = userFactory()
  expect(() => store.delete(data)).toThrowError(
    'Cannot delete the input because it is not a valid document.',
  )
})
