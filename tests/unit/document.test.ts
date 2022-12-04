import { Store } from '../../src'
import { getDocumentType, isDocument } from '../../src/document'
import { Document } from '../../src/types'
import { User, schema, TypesMap } from '../fixtures'
import { userFactory } from '../utils/factories'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

describe('`isDocument`', () => {
  it('should return `true` if the input is document', () => {
    const data = userFactory()
    store.add('User', data)
    const user = store.findFirst('User')

    expect(isDocument(user)).toEqual(true)
  })

  it('should return `false` if the input is not a document', () => {
    const data = userFactory()
    expect(isDocument(data)).toEqual(false)
  })
})
describe('`getDocumentType`', () => {
  it('should get the document type', () => {
    const data = userFactory()

    store.add('User', data)
    const user = store.findFirstOrThrow('User') as Document<User>

    expect(getDocumentType(user)).toEqual('User')
  })
})
