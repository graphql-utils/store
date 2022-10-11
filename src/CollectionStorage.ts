import { GraphQLNamedType, GraphQLSchema, isObjectType } from 'graphql'
import { DocumentCollection } from './DocumentCollection'

export class CollectionStorage<TypesMap extends Record<string, any>> {
  private schema
  private collections

  constructor(schema: GraphQLSchema) {
    this.schema = schema
    this.collections = initializeCollections<TypesMap>(schema)
  }

  get<Type extends keyof TypesMap>(
    type: Type,
  ): DocumentCollection<TypesMap[Type]> {
    const collection = this.collections.get(type)

    if (!collection) {
      throw new Error('Integrity Failed.')
    }

    return collection as DocumentCollection<TypesMap[Type]>
  }
}

function initializeCollections<
  TypesMap extends Record<string, any>,
  TypeName extends keyof TypesMap = keyof TypesMap,
>(
  schema: GraphQLSchema,
): Map<TypeName, DocumentCollection<TypesMap[TypeName]>> {
  const nonRootObjectTypeNames = Object.values(schema.getTypeMap()).filter(
    isNonRootObjectType,
  )

  return new Map(
    nonRootObjectTypeNames.map((type) => [
      type.name as TypeName,
      new DocumentCollection<TypesMap[TypeName]>(),
    ]),
  )
}

function isNonRootObjectType(type: GraphQLNamedType) {
  const rootTypeNames = ['Query', 'Mutation', 'Subscription']

  return (
    isObjectType(type) &&
    !isInternalTypeName(type.name) &&
    !rootTypeNames.includes(type.name)
  )
}

function isInternalTypeName(typeName: string) {
  return typeName.startsWith('__')
}
