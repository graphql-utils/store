import { GraphQLSchema } from 'graphql'
import { PredicateFunction, Schema } from './types'
import { CollectionStorage } from './CollectionStorage'
import { resolveGraphQLSchema } from './resolveGraphQLSchema'
import { createDocument } from './createDocument'

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

  findFirstOrThrow<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): TypesMap[Type] {
    const document = this.collections.get(type).findFirst(predicate)

    if (!document) {
      throw new Error('Document not found.')
    }

    return document
  }

  reset(): void {
    this.collections = new CollectionStorage<TypesMap>(this.schema)
  }
}
