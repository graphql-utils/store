import { GraphQLSchema } from 'graphql'
import { PredicateFunction, Schema } from './types'
import { CollectionStorage } from './CollectionStorage'
import { resolveGraphQLSchema } from './resolveGraphQLSchema'
import { createDocument } from './createDocument'
import { getDocumentKey, getDocumentType, isDocument } from './utils'

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
    const document = createDocument(type as string, data)
    return this.collections.get(type).create(document)
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

    return this.collections
      .get(type)
      .create(
        createDocument<TypesMap[string]>(
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
    return this.collections.get(type).findFirst(predicate)
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
    return this.collections.get(type).find(predicate)
  }

  count<Type extends keyof TypesMap>(type: Type): number {
    return this.collections.get(type).count()
  }

  reset(): void {
    this.collections = new CollectionStorage<TypesMap>(this.schema)
  }
}
