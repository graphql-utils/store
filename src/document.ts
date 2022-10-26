import { nanoid } from 'nanoid'
import { Document } from './types'

export const DOCUMENT_KEY = Symbol('DOCUMENT_KEY')
export const DOCUMENT_TYPE = Symbol('DOCUMENT_TYPE')

export class DocumentRef {
  constructor(public type: string, public key: string) {}
}

export class DocumentRefCollection {
  constructor(public refs: Array<DocumentRef>) {}
}

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

export function documentToRef(document: Document<unknown>): DocumentRef {
  return new DocumentRef(getDocumentType(document), getDocumentKey(document))
}

export function documentsToRefCollection(
  documents: Array<Document<unknown>>,
): DocumentRefCollection {
  return new DocumentRefCollection(
    documents.map((document) => documentToRef(document)),
  )
}

export function isDocumentRef(input: unknown): input is DocumentRef {
  return input instanceof DocumentRef
}

export function isDocumentRefCollection(
  input: unknown,
): input is DocumentRefCollection {
  return input instanceof DocumentRefCollection
}

export function generateDocumentKey() {
  return nanoid(16)
}
