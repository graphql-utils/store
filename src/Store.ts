import { GraphQLSchema } from 'graphql'
import { Document, PredicateFunction, Schema } from './types'
import { CollectionStorage } from './CollectionStorage'
import { resolveGraphQLSchema } from './resolveGraphQLSchema'
import {
  DOCUMENT_KEY,
  DOCUMENT_TYPE,
  DocumentRef,
  DocumentRefCollection,
  documentsToRefCollection,
  documentToRef,
  generateDocumentKey,
  getDocumentKey,
  getDocumentType,
  isDocument,
  isDocumentRef,
  isDocumentRefCollection,
} from './document'

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
    const newDocument = this.createDocument(
      type,
      { ...document, ...data } as TypesMap[string],
      key,
    )

    return this.storage.collection(type).create(newDocument)
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
        return Object.defineProperty(document, field, {
          value: documentsToRefCollection(
            document[field].map((item: TypesMap[string]) =>
              this.create(type, item),
            ),
          ),
        })
      }

      return Object.defineProperty(document, field, {
        value: documentToRef(this.create(type, document[field])),
      })
    })

    return new Proxy(document, {
      get: (target, prop) => {
        const field = Reflect.get(document, prop)

        if (isDocumentRefCollection(field)) {
          return this.resolveDocumentsFromRefCollection(field)
        }

        if (isDocumentRef(field)) {
          return this.resolveDocumentFromRef(field)
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

  protected resolveDocumentsFromRefCollection(
    collection: DocumentRefCollection,
  ) {
    return collection.refs.map((ref) => this.resolveDocumentFromRef(ref))
  }

  protected resolveDocumentFromRef(ref: DocumentRef) {
    return this.storage.collection(ref.type).getByKey(ref.key)
  }
}
