import { DocumentNode, GraphQLSchema } from 'graphql/index'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from './document'

export type Schema = GraphQLSchema | DocumentNode | string

export type Document<DocumentType> = DocumentType & {
  [DOCUMENT_KEY]: string
  [DOCUMENT_TYPE]: string
}

export type PredicateFunction<T> = (data: T) => boolean
export type Relation = { field: string; type: string }
