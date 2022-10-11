import {
  buildASTSchema,
  buildSchema,
  GraphQLSchema,
  isSchema,
  Kind,
} from 'graphql'
import { Schema } from './types'

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
