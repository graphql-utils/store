import {
  buildASTSchema,
  buildSchema,
  getNamedType,
  getNullableType,
  GraphQLField,
  GraphQLList,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  isListType,
  isNullableType,
  isObjectType,
  isSchema,
  Kind,
} from 'graphql'
import { Schema } from './types'
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
>(
  schemaTypes: Array<GraphQLObjectType>,
): Map<TypeName, Array<OneToOneRelation | OneToManyRelation>> {
  return new Map(
    schemaTypes.map((type) => {
      return [type.name as TypeName, resolveTypeRelations(type)]
    }),
  )
}

export function resolveTypeRelations(
  type: GraphQLObjectType,
): Array<OneToManyRelation | OneToOneRelation> {
  const typeFields = type.getFields()

  return Object.values(typeFields).reduce<
    Array<OneToManyRelation | OneToOneRelation>
  >((acc, field) => {
    if (isRelationField(field)) {
      if (isListType(getNullableType(field.type))) {
        return [
          ...acc,
          new OneToManyRelation(
            field.name,
            getNamedType(field.type).name,
            isNullableType(field.type),
            isNullableType(
              (getNullableType(field.type) as GraphQLList<GraphQLType>).ofType,
            ),
          ),
        ]
      }

      return [
        ...acc,
        new OneToOneRelation(
          field.name,
          getNamedType(field.type).name,
          isNullableType(field.type),
        ),
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

export class OneToOneRelation {
  constructor(
    public field: string,
    public type: string,
    public isNullable: boolean,
  ) {}
}

export class OneToManyRelation {
  constructor(
    public field: string,
    public type: string,
    public isNullableList: boolean,
    public hasNullableItems: boolean,
  ) {}
}
