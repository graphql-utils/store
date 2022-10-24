import { nanoid } from 'nanoid'
import { Document, DocumentRef, DocumentRefCollection } from './types'
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

export function generateDocumentKey() {
  return nanoid(16)
}

export function createDocumentRef(key: string, type: string): DocumentRef {
  return { $ref: { key, type } }
}

export function isDocumentRef(input: unknown): input is DocumentRef {
  return (
    input !== null && typeof input === 'object' && Reflect.has(input, '$ref')
  )
}

export function isDocumentRefCollection(
  input: unknown,
): input is DocumentRefCollection {
  return (
    input !== null && typeof input === 'object' && Reflect.has(input, '$refs')
  )
}
