import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { postFactory, userFactory } from './utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should return the first document', () => {
  const user = store.create('User', userFactory())
  store.create('User', userFactory())
  store.create('User', userFactory())

  expect(store.findFirstOrThrow('User')).toEqual(user)

  const post = store.create('Post', postFactory())
  store.create('Post', postFactory())
  store.create('Post', postFactory())

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
  store.create('User', userFactory())
  store.create('User', userFactory())
  const user = store.create('User', userFactory({ username: 'john.doe' }))

  expect(
    store.findFirstOrThrow('User', (user) => user.username === 'john.doe'),
  ).toEqual(user)

  store.create('Post', postFactory())
  store.create('Post', postFactory())
  const post = store.create('Post', postFactory({ title: 'Hello World!' }))

  expect(
    store.findFirstOrThrow('Post', (post) => post.title === 'Hello World!'),
  ).toEqual(post)
})
