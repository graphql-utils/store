import { Document, PredicateFunction } from './types'
import { getDocumentKey } from './document'

export class DocumentCollection<DocumentType> {
  private documents

  constructor() {
    this.documents = new Map<string, DocumentType>()
  }

  add(document: Document<DocumentType>) {
    this.documents.set(getDocumentKey(document), document)
    return document
  }

  findFirst(
    predicate?: PredicateFunction<DocumentType>,
  ): DocumentType | undefined {
    if (predicate) {
      for (const document of this.documents.values()) {
        if (predicate(document)) {
          return document
        }
      }
    }

    return this.documents.values().next().value
  }

  find(predicate?: PredicateFunction<DocumentType>): Array<DocumentType> {
    const documents = [...this.documents.values()]

    if (predicate) {
      return documents.filter(predicate)
    }

    return documents
  }

  count(): number {
    return this.documents.size
  }

  getByKey(documentKey: string) {
    return this.documents.get(documentKey)
  }

  clear() {
    return this.documents.clear()
  }
}
