import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { toCollection } from './utils'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should clear all collections at once', () => {
  toCollection(() => store.add('User', userFactory()), 5)
  toCollection(() => store.add('Post', postFactory()), 5)

  expect(store.count('User')).toEqual(5)
  expect(store.count('Post')).toEqual(5)

  store.reset()

  expect(store.count('User')).toEqual(0)
  expect(store.count('Post')).toEqual(0)
})
