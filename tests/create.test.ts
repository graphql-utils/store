import { Store } from '../src'
import { schema, TypesMap } from './fixtures'
import { userFactory } from './utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('can create and store a new entity ', () => {
  const user = userFactory()
  store.create('User', user)

  expect(store.findFirstOrThrow('User')).toEqual(user)
})
