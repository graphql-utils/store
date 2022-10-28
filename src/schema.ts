import {
  buildASTSchema,
  buildSchema,
  getNamedType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  isObjectType,
  isSchema,
  Kind,
} from 'graphql'
import { Relation, Schema } from './types'
import { DocumentCollection } from './DocumentCollection'

export function resolveGraphQLSchema(schema: Schema): GraphQLSchema {
  if (isSchema(schema)) {
    return schema
  }

  if (typeof schema === 'object' && schema.kind === Kind.DOCUMENT) {
    return buildASTSchema(schema)
  }

  if (typeof schema === 'string') {
    return buildSchema(schema)
  }

  throw new Error('[@graphql-utils/store] Error: Invalid schema provided.')
}

export function resolveSchemaObjectTypes(
  schema: GraphQLSchema,
): GraphQLObjectType[] {
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

export function resolveSchemaRelations<
  TypesMap extends Record<string, any>,
  TypeName extends keyof TypesMap = keyof TypesMap,
>(schemaTypes: Array<GraphQLObjectType>): Map<TypeName, Array<Relation>> {
  return new Map(
    schemaTypes.map((type) => {
      return [type.name as TypeName, resolveTypeRelations(type)]
    }),
  )
}

export function resolveTypeRelations(type: GraphQLObjectType): Array<Relation> {
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

export function initializeCollections<
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
