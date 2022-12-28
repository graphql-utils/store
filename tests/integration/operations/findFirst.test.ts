import { createStore } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { postFactory, userFactory } from '../../utils/factories'

const store = createStore<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should return the first document', () => {
  const user = store.add('User', userFactory())
  store.add('User', userFactory())
  store.add('User', userFactory())

  expect(store.findFirst('User')).toEqual(user)

  const post = store.add('Post', postFactory())
  store.add('Post', postFactory())
  store.add('Post', postFactory())

  expect(store.findFirst('Post')).toEqual(post)
})

it('should return `undefined` if no user exists', () => {
  expect(store.findFirst('User')).toBeUndefined()
  expect(store.findFirst('Post')).toBeUndefined()
})

it('can find specific document with a predicate function', () => {
  store.add('User', userFactory())
  store.add('User', userFactory())
  const user = store.add('User', userFactory({ username: 'john.doe' }))

  expect(
    store.findFirst('User', (user) => user.username === 'john.doe'),
  ).toEqual(user)

  store.add('Post', postFactory())
  store.add('Post', postFactory())
  const post = store.add('Post', postFactory({ likes: 99999 }))

  expect(
    store.findFirstOrThrow('Post', (post) => post.likes === 99999),
  ).toEqual(post)
})
