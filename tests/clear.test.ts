import { Store } from '../src'
import { Post, schema, TypesMap, User } from './fixtures'
import { postFactory, userFactory } from './utils/factories'
import { Document } from '../src/types'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can delete an entire document', () => {
  const user = userFactory()
  store.create('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)

  store.clear('User')

  expect(store.count('User')).toEqual(0)
})

it('should not delete irrelevant documents', () => {
  store.create('User', userFactory()) as Document<User>
  store.create('Post', postFactory()) as Document<Post>

  store.clear('User')

  expect(store.count('User')).toEqual(0)

  expect(store.count('Post')).toEqual(1)
})

it('should not delete the relations', () => {
  const data = userFactory()
  const user = store.create('User', data)

  expect(store.findFirstOrThrow('UserProfile')).toEqual(user.profile)

  store.clear('User')

  expect(store.count('User')).toEqual(0)

  expect(store.findFirstOrThrow('UserProfile')).toEqual(user.profile)
})
