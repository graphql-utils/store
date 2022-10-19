import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { toCollection } from './utils'
import { postFactory, userFactory } from './utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should return the count of stored documents for given type', () => {
  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(0)

  toCollection(() => store.create('User', userFactory()), 5)
  toCollection(() => store.create('Post', postFactory()), 5)

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)
})
