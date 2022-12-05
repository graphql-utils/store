import { createStore } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import {
  imageFactory,
  profileFactory,
  userFactory,
} from '../../utils/factories'

const store = createStore<TypesMap>({
  schema,
})

afterEach(() => store.reset())

describe('create', () => {
  it('should create a `one-to-one` `required` relation', () => {
    const data = userFactory({ profile: profileFactory() })
    const user = store.add('User', data)

    expect(user.profile).toEqual(data.profile)
    expect(store.findFirstOrThrow('User').profile).toEqual(data.profile)
    expect(store.findFirstOrThrow('Profile')).toEqual(user.profile)
  })

  it('should create a `one-to-one` `nullable` relation with value', () => {
    const data = profileFactory({ avatar: imageFactory() })
    const profile = store.add('Profile', data)

    expect(profile.avatar).toEqual(data.avatar)
    expect(store.findFirstOrThrow('Profile').avatar).toEqual(data.avatar)
    expect(store.findFirstOrThrow('Image')).toEqual(profile.avatar)
  })

  it('should create a `one-to-one` `nullable` relation with null', () => {
    const data = profileFactory({ avatar: null })
    const profile = store.add('Profile', data)

    expect(profile.avatar).toBeNull()
    expect(store.findFirstOrThrow('Profile').avatar).toBeNull()
  })

  it('should create a `one-to-one` `nullable` relation with undefined', () => {
    const data = profileFactory({ avatar: undefined })
    const profile = store.add('Profile', data)

    expect(profile.avatar).toBeUndefined()
    expect(store.findFirstOrThrow('Profile').avatar).toBeUndefined()
  })
})
