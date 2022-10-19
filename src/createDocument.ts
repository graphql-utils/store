import { Document } from './types'
import { DOCUMENT_KEY, DOCUMENT_TYPE } from './constants'
import { nanoid } from 'nanoid'

export function createDocument<DocumentType extends Record<string, unknown>>(
  type: string,
  data: DocumentType,
  documentKey: string = generateDocumentKey(),
): Document<DocumentType> {
  const document = structuredClone(data)

  Reflect.defineProperty(document, DOCUMENT_KEY, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: documentKey,
  })

  Reflect.defineProperty(document, DOCUMENT_TYPE, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: type,
  })

  return createDocumentProxy(document as Document<DocumentType>)
}

function createDocumentProxy<DocumentType extends Record<string, unknown>>(
  document: Document<DocumentType>,
): Document<DocumentType> {
  return new Proxy(document, {
    get(target, prop) {
      if (Reflect.has(document, prop) || typeof prop !== 'string') {
        return Reflect.get(document, prop)
      }
    },

    set() {
      throw new Error('Documents are immutable.')
    },
  })
}

function generateDocumentKey() {
  return nanoid(16)
}
