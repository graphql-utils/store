import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { toCollection } from './utils'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should delete single documents in a collection', () => {
  toCollection(() => store.create('User', userFactory()), 5)
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
  toCollection(() => store.create('User', userFactory()), 5)
  toCollection(() => store.create('Post', postFactory()), 5)
  const user = store.findFirstOrThrow('User')

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)

  store.delete(user)

  expect(store.count('User')).toEqual(4)
  expect(store.count('Post')).toEqual(5)
  expect(
    store.find('User', (data) => {
      return data.username.startsWith(user.username)
    }),
  ).toEqual([])
})

it('should throw error if input document is not valid', () => {
  const data = userFactory()
  expect(() => store.delete(data)).toThrowError(
    'Cannot delete the document because it is not a valid document.',
  )
})
