import { Document, PredicateFunction } from './types'
import { DOCUMENT_KEY } from './constants'

export class DocumentCollection<DocumentType> {
  private documents

  constructor() {
    this.documents = new Map<string, DocumentType>()
  }

  create(document: Document<DocumentType>) {
    this.documents.set(document[DOCUMENT_KEY], document)
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
}
