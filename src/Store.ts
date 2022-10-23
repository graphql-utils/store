import { GraphQLSchema } from 'graphql'
import { Document, PredicateFunction, Schema } from './types'
import { CollectionStorage } from './CollectionStorage'
import { resolveGraphQLSchema } from './resolveGraphQLSchema'
import {
  createDocumentRef,
  generateDocumentKey,
  getDocumentKey,
  getDocumentType,
  isDocument,
  isDocumentRef,
} from './utils'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from './constants'

interface StoreConfiguration {
  schema: Schema
}

export class Store<TypesMap extends Record<string, any>> {
  protected storage
  protected schema: GraphQLSchema

  constructor(config: StoreConfiguration) {
    this.schema = resolveGraphQLSchema(config.schema)
    this.storage = new CollectionStorage<TypesMap>(this.schema)
  }

  create<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
  ): TypesMap[Type] {
    const document = this.createDocument(type, data)

    return this.storage.collection(type).create(document)
  }

  update<Type extends TypesMap[keyof TypesMap]>(
    document: Type,
    data: Partial<Type>,
  ): Type {
    if (!isDocument(document)) {
      throw new Error('Input document is not a valid document.')
    }

    const type = getDocumentType(document)
    const key = getDocumentKey(document)

    return this.storage
      .collection(type)
      .create(
        this.createDocument(
          type,
          { ...document, ...data } as TypesMap[string],
          key,
        ),
      )
  }

  findFirst<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): TypesMap[Type] | undefined {
    return this.storage.collection(type).findFirst(predicate)
  }

  findFirstOrThrow<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): TypesMap[Type] {
    const document = this.findFirst(type, predicate)

    if (!document) {
      throw new Error('Document not found.')
    }

    return document
  }

  find<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): Array<TypesMap[Type]> {
    return this.storage.collection(type).find(predicate)
  }

  count<Type extends keyof TypesMap>(type: Type): number {
    return this.storage.collection(type).count()
  }

  reset(): void {
    this.storage = new CollectionStorage<TypesMap>(this.schema)
  }

  protected createDocument<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
    documentKey?: string,
  ): Document<TypesMap[Type]> {
    const document = structuredClone(data)

    Reflect.defineProperty(document, DOCUMENT_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: documentKey || generateDocumentKey(),
    })

    Reflect.defineProperty(document, DOCUMENT_TYPE, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: type,
    })

    this.storage.relations(type).forEach(({ field, type }) => {
      if (Array.isArray(document[field])) {
        // TODO Implement one-to-many relation
        return
      }

      const targetDocument = this.create(type, document[field])
      Object.defineProperty(document, field, {
        value: createDocumentRef(
          getDocumentKey(targetDocument),
          getDocumentType(targetDocument),
        ),
      })
    })

    return new Proxy(document, {
      get: (target, prop) => {
        const data = Reflect.get(document, prop)

        if (isDocumentRef(data)) {
          return this.storage.collection(data.$ref.type).getByKey(data.$ref.key)
        }

        if (Reflect.has(document, prop) || typeof prop !== 'string') {
          return Reflect.get(document, prop)
        }
      },

      set() {
        throw new Error('Documents are immutable.')
      },
    })
  }
}
