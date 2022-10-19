import { Document } from './types'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from './constants'

export function getDocumentKey<T>(document: Document<T>) {
  return document[DOCUMENT_KEY]
}

export function getDocumentType<T>(document: Document<T>) {
  return document[DOCUMENT_TYPE]
}

export function isDocument(document: unknown): document is Document<unknown> {
  return (
    document !== null &&
    typeof document === 'object' &&
    Reflect.has(document, DOCUMENT_KEY) &&
    Reflect.has(document, DOCUMENT_TYPE)
  )
}
