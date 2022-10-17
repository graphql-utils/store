import { Document } from './types'
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

  find(): DocumentType | undefined {
    return this.documents.values().next().value
  }
}
