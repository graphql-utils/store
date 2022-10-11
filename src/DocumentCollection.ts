export class DocumentCollection<DocumentType> {
  private documents

  constructor() {
    this.documents = new Map<string, DocumentType>()
  }

  create(key: string, data: DocumentType) {
    this.documents.set(key, data)

    return data
  }

  find(): DocumentType | undefined {
    return this.documents.values().next().value
  }
}
