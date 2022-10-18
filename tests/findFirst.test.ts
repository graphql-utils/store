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

  expect(store.findFirst('User')).toEqual(user)

  const post = store.create('Post', postFactory())
  store.create('Post', postFactory())
  store.create('Post', postFactory())

  expect(store.findFirst('Post')).toEqual(post)
})

it('should return `undefined` if no user exists', () => {
  expect(store.findFirst('User')).toBeUndefined()
  expect(store.findFirst('Post')).toBeUndefined()
})

it('can find specific document with a predicate function', () => {
  store.create('User', userFactory())
  store.create('User', userFactory())
  const user = store.create('User', userFactory({ username: 'john.doe' }))

  expect(
    store.findFirst('User', (user) => user.username === 'john.doe'),
  ).toEqual(user)

  store.create('Post', postFactory())
  store.create('Post', postFactory())
  const post = store.create('Post', postFactory({ title: 'Hello World!' }))

  expect(
    store.findFirst('Post', (post) => post.title === 'Hello World!'),
  ).toEqual(post)
})
