import { randUserName } from '@ngneat/falso'
import { Store } from '../src'
import { TypesMap, schema } from './fixtures'
import { userFactory } from './utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should store immutable documents', () => {
  const user = userFactory()
  store.create('User', user)
  user.username = randUserName()

  expect(store.findFirstOrThrow('User')?.username).not.toEqual(user.username)
})

it('should not be possible to mutate retrieved document', () => {
  store.create('User', userFactory())

  const retrieved = store.findFirstOrThrow('User')

  expect(() => (retrieved.username = randUserName())).toThrowError(
    'Documents are immutable.',
  )
})

it('should store immutable documents when updating an existing document', () => {
  const user = store.create('User', userFactory())
  const data = userFactory()

  const updatedUser = store.update(user, data)
  expect(updatedUser).toEqual(data)

  data.username = randUserName()
  expect(updatedUser).not.toEqual(data)
})

it('should not be possible to mutate updated document', () => {
  const user = store.create('User', userFactory())
  const updatedUser = store.update(user, userFactory())

  expect(() => (updatedUser.username = randUserName())).toThrowError(
    'Documents are immutable.',
  )
})
