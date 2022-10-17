import { DocumentNode, GraphQLSchema } from 'graphql/index'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from './constants'

export type Schema = GraphQLSchema | DocumentNode | string

export type Document<DocumentType> = DocumentType & {
  [DOCUMENT_KEY]: string
  [DOCUMENT_TYPE]: string
}
