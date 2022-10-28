import type { DocumentCollection } from './DocumentCollection'
import { Document, PredicateFunction } from './types'
import { getDocumentKey, getDocumentType, isDocument } from './document'

export abstract class Operations<TypesMap extends Record<string, any>> {
  protected abstract collection<Type extends keyof TypesMap>(
    type: Type,
  ): DocumentCollection<TypesMap[Type]>

  protected abstract createDocument<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
    documentKey?: string,
  ): Document<TypesMap[Type]>

  create<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
  ): TypesMap[Type] {
    return this.collection(type).create(this.createDocument(type, data))
  }

  update<Type extends TypesMap[keyof TypesMap]>(
    document: Type,
    data: Partial<Type>,
  ): Type {
    if (!isDocument(document)) {
      throw new Error('Input document is not a valid document.')
    }

    const type = getDocumentType(document)
    const newDocument = this.createDocument(
      type,
      { ...document, ...data } as TypesMap[string],
      getDocumentKey(document),
    )

    return this.collection(type).create(newDocument)
  }

  findFirst<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): TypesMap[Type] | undefined {
    return this.collection(type).findFirst(predicate)
  }

  findFirstOrThrow<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): TypesMap[Type] {
    const document = this.findFirst(type, predicate)

    if (!document) {
      throw new Error('Document not found.')
    }

    return document
  }

  find<Type extends keyof TypesMap>(
    type: Type,
    predicate?: PredicateFunction<TypesMap[Type]>,
  ): Array<TypesMap[Type]> {
    return this.collection(type).find(predicate)
  }

  count<Type extends keyof TypesMap>(type: Type): number {
    return this.collection(type).count()
  }
}
