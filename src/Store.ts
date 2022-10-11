import { GraphQLSchema } from 'graphql'
import { Schema } from './types'
import { CollectionStorage } from './CollectionStorage'
import { nanoid } from 'nanoid'
import { resolveGraphQLSchema } from './resolveGraphQLSchema'
import { DOCUMENT_KEY_SYMBOL } from './constants'

interface StoreConfiguration {
  schema: Schema
}

export class Store<TypesMap extends Record<string, any>> {
  protected collections
  protected schema: GraphQLSchema

  constructor(config: StoreConfiguration) {
    this.schema = resolveGraphQLSchema(config.schema)
    this.collections = new CollectionStorage<TypesMap>(this.schema)
  }

  create<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
  ): TypesMap[Type] {
    const documentKey = generateDocumentKey()
    const document = structuredClone(data)

    Object.defineProperty(document, DOCUMENT_KEY_SYMBOL, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: documentKey,
    })

    return this.collections.get(type).create(
      documentKey,
      new Proxy(document, {
        get(target: TypesMap[Type], prop: string | symbol): any {
          if (Reflect.has(document, prop) || typeof prop !== 'string') {
            return Reflect.get(document, prop)
          }
        },

        set() {
          throw new Error('Documents are immutable.')
        },
      }),
    )
  }

  findFirstOrThrow<Type extends keyof TypesMap>(type: Type): TypesMap[Type] {
    const document = this.collections.get(type).find()

    if (!document) {
      throw new Error('Document not found.')
    }

    return document
  }

  reset(): void {
    this.collections = new CollectionStorage<TypesMap>(this.schema)
  }
}

function generateDocumentKey() {
  return nanoid(16)
}
