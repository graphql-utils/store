import { randUserName } from '@ngneat/falso'
import { Store } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { userFactory, profileFactory } from '../../utils/factories'
import { Document } from '../../../src/types'
import { User } from '../../fixtures'
import { getDocumentKey, getDocumentType } from '../../../src/document'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should update an existing document', () => {
  const user = store.add('User', userFactory()) as Document<User>
  expect(store.findFirstOrThrow('User')).toEqual(user)

  const data = userFactory()
  const updatedUser = store.update(user, data) as Document<User>

  expect(updatedUser).toEqual(data)
  expect(updatedUser).not.toEqual(user)
  expect(getDocumentKey(updatedUser)).toEqual(getDocumentKey(user))
  expect(getDocumentType(updatedUser)).toEqual(getDocumentType(user))
  expect(store.findFirstOrThrow('User')).toEqual(updatedUser)
})

it('should throw error if input document is not valid', () => {
  const data = userFactory()
  expect(() => store.update(data, data)).toThrowError(
    'Input document is not a valid document.',
  )
})

it('can update document partially', () => {
  const user = store.add('User', userFactory())

  const data: Partial<User> = {
    username: randUserName(),
    profile: profileFactory(),
  }

  const updatedUser = store.update(user, data)

  expect(updatedUser.username).toEqual(data.username)
  expect(updatedUser).toEqual({ ...user, ...data })
  expect(store.findFirstOrThrow('User')).toEqual({ ...user, ...data })
})
