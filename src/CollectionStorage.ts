import {
  getNamedType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  isObjectType,
} from 'graphql'
import { DocumentCollection } from './DocumentCollection'

export type Relation = { field: string; type: string }

export class CollectionStorage<TypesMap extends Record<string, any>> {
  private readonly collections
  private readonly _relations

  constructor(schema: GraphQLSchema) {
    const schemaObjectTypes = resolveSchemaObjectTypes(schema)

    this.collections = initializeCollections<TypesMap>(schemaObjectTypes)
    this._relations = resolveSchemaRelations<TypesMap>(schemaObjectTypes)
  }

  collection<Type extends keyof TypesMap>(
    type: Type,
  ): DocumentCollection<TypesMap[Type]> {
    const collection = this.collections.get(type)

    if (!collection) {
      throw new Error('Integrity Failed.')
    }

    return collection as DocumentCollection<TypesMap[Type]>
  }

  relations<Type extends keyof TypesMap>(type: Type): Array<Relation> {
    const relations = this._relations.get(type)

    if (!relations) {
      throw new Error('Integrity Failed.')
    }

    return relations
  }
}

function resolveSchemaObjectTypes(schema: GraphQLSchema): GraphQLObjectType[] {
  return Object.values(schema.getTypeMap()).filter(isNonRootObjectType)
}

function isNonRootObjectType(
  type: GraphQLNamedType,
): type is GraphQLObjectType {
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

function resolveSchemaRelations<
  TypesMap extends Record<string, any>,
  TypeName extends keyof TypesMap = keyof TypesMap,
>(schemaTypes: Array<GraphQLObjectType>): Map<TypeName, Array<Relation>> {
  return new Map(
    schemaTypes.map((type) => {
      return [type.name as TypeName, resolveTypeRelations(type)]
    }),
  )
}

function resolveTypeRelations(type: GraphQLObjectType): Array<Relation> {
  const typeFields = type.getFields()

  return Object.values(typeFields).reduce<Array<Relation>>((acc, field) => {
    if (isRelationField(field)) {
      return [
        ...acc,
        { field: field.name, type: getNamedType(field.type).name },
      ]
    }

    return acc
  }, [])
}

function isRelationField(field: GraphQLField<unknown, unknown>) {
  return getNamedType(field.type) instanceof GraphQLObjectType
}

function initializeCollections<
  TypesMap extends Record<string, any>,
  TypeName extends keyof TypesMap = keyof TypesMap,
>(
  schemaTypes: Array<GraphQLObjectType>,
): Map<TypeName, DocumentCollection<TypesMap[TypeName]>> {
  return new Map(
    schemaTypes.map((type) => [
      type.name as TypeName,
      new DocumentCollection<TypesMap[TypeName]>(),
    ]),
  )
}
