import { randUserName } from '@ngneat/falso'
import { Store } from '../src'
import { TypesMap, schema } from './fixtures'
import { userFactory } from './utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should store immutable data', () => {
  const user = userFactory()
  store.create('User', user)
  user.username = randUserName()

  expect(store.findFirstOrThrow('User')?.username).not.toEqual(user.username)
})

it('should not be possible to mutate retrieved data', () => {
  store.create('User', userFactory())

  const retrieved = store.findFirstOrThrow('User')

  expect(() => (retrieved.username = randUserName())).toThrowError('')
})
