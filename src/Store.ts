import { GraphQLSchema } from 'graphql'
import { Document, Relation, Schema } from './types'
import {
  initializeCollections,
  resolveGraphQLSchema,
  resolveSchemaObjectTypes,
  resolveSchemaRelations,
} from './schema'
import {
  DocumentRef,
  DocumentRefCollection,
  documentsToRefCollection,
  documentToRef,
  isDocumentRef,
  isDocumentRefCollection,
  dataToDocument,
} from './document'
import { Operations } from './Operations'
import { DocumentCollection } from './DocumentCollection'

interface StoreConfiguration {
  schema: Schema
}

export class Store<
  TypesMap extends Record<string, any>,
> extends Operations<TypesMap> {
  private _collections
  private _relations

  protected schema: GraphQLSchema

  constructor(config: StoreConfiguration) {
    super()

    this.schema = resolveGraphQLSchema(config.schema)
    const schemaObjectTypes = resolveSchemaObjectTypes(this.schema)

    this._collections = initializeCollections<TypesMap>(schemaObjectTypes)
    this._relations = resolveSchemaRelations<TypesMap>(schemaObjectTypes)
  }

  protected collection<Type extends keyof TypesMap>(
    type: Type,
  ): DocumentCollection<TypesMap[Type]> {
    const collection = this._collections.get(type)

    if (!collection) {
      throw new Error('Integrity Failed.')
    }

    return collection as DocumentCollection<TypesMap[Type]>
  }

  protected relations<Type extends keyof TypesMap>(
    type: Type,
  ): Array<Relation> {
    const relations = this._relations.get(type)

    if (!relations) {
      throw new Error('Integrity Failed.')
    }

    return relations
  }

  reset(): void {
    for (const collection of this._collections.values()) {
      collection.clear()
    }
  }

  protected createDocument<Type extends keyof TypesMap>(
    type: Type,
    data: TypesMap[Type],
    documentKey?: string,
  ): Document<TypesMap[Type]> {
    const document = dataToDocument(
      structuredClone(data),
      type as string,
      documentKey,
    )

    this.relations(type).forEach(({ field, type, isNullable }) => {
      if (Array.isArray(document[field])) {
        return Object.defineProperty(document, field, {
          value: documentsToRefCollection(
            document[field].map((item: TypesMap[string]) =>
              this.add(type, item),
            ),
          ),
        })
      }

      if (
        isNullable &&
        (document[field] === null || document[field] === undefined)
      ) {
        return document[field]
      }

      return Object.defineProperty(document, field, {
        value: documentToRef(this.add(type, document[field])),
      })
    })

    return new Proxy(document, {
      get: (target, prop) => {
        const field = Reflect.get(document, prop)

        if (isDocumentRefCollection(field)) {
          return this.resolveDocumentsFromRefCollection(field)
        }

        if (isDocumentRef(field)) {
          return this.resolveDocumentFromRef(field)
        }

        if (Reflect.has(document, prop) || typeof prop !== 'string') {
          return Reflect.get(document, prop)
        }
      },

      defineProperty() {
        throw new Error('Documents are immutable.')
      },

      set() {
        throw new Error('Documents are immutable.')
      },
    })
  }

  protected resolveDocumentsFromRefCollection(
    collection: DocumentRefCollection,
  ) {
    return collection.refs.map((ref) => this.resolveDocumentFromRef(ref))
  }

  protected resolveDocumentFromRef(ref: DocumentRef) {
    return this.collection(ref.type).getByKey(ref.key)
  }
}
