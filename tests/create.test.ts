import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { User } from './fixtures/schema.types'
import { randUserName, randUuid } from '@ngneat/falso'

function userFactory(): User {
  return {
    id: randUuid(),
    username: randUserName(),
    posts: [],
  }
}

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can create and store a new entity ', () => {
  const user = userFactory()
  store.create('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)
})

it('should store immutable data', () => {
  const user = userFactory()
  store.create('User', user)
  user.username = randUserName()

  expect(store.findFirstOrThrow('User')?.username).not.toEqual('johndoe')
})

it('should not be possible to mutate retrieved data', () => {
  store.create('User', userFactory())

  const retrieved = store.findFirstOrThrow('User')

  expect(() => (retrieved.username = randUserName())).toThrowError('')
})
