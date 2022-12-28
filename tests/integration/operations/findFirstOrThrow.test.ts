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

  expect(store.findFirstOrThrow('User')).toEqual(user)

  const post = store.add('Post', postFactory())
  store.add('Post', postFactory())
  store.add('Post', postFactory())

  expect(store.findFirstOrThrow('Post')).toEqual(post)
})

it('should throw error if first user is undefined', () => {
  expect(() => {
    store.findFirstOrThrow('User')
  }).toThrowError('Document not found.')

  expect(() => {
    store.findFirstOrThrow('Post')
  }).toThrowError('Document not found.')
})

it('can find specific document with a predicate function', () => {
  store.add('User', userFactory())
  store.add('User', userFactory())
  const user = store.add('User', userFactory({ username: 'john.doe' }))

  expect(
    store.findFirstOrThrow('User', (user) => user.username === 'john.doe'),
  ).toEqual(user)

  store.add('Post', postFactory())
  store.add('Post', postFactory())
  const post = store.add('Post', postFactory({ likes: 99999 }))

  expect(
    store.findFirstOrThrow('Post', (post) => post.likes === 99999),
  ).toEqual(post)
})
