import { GraphQLSchema } from 'graphql'
import { Document } from './types'
import {
  initializeCollections,
  OneToManyRelation,
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
import { proxy } from './proxy'

interface StoreConfiguration {
  schema: GraphQLSchema
}

export class Store<
  TypesMap extends Record<string, any>,
> extends Operations<TypesMap> {
  private _collections
  private _relations

  protected schema: GraphQLSchema

  constructor(option: StoreConfiguration) {
    super()

    this.schema = option.schema
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

  protected relations<Type extends keyof TypesMap>(type: Type) {
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

    for (const relation of this.relations(type)) {
      if (relation instanceof OneToManyRelation) {
        if (!relation.isNullableList && !document[relation.field]) {
          throw new Error('Can not create a non-nullable relation with null')
        }

        if (relation.isNullableList && document[relation.field] == null) {
          continue
        }

        if (
          !relation.hasNullableItems &&
          (document[relation.field].includes(null) ||
            document[relation.field].includes(undefined))
        ) {
          throw new Error('Can not create a non-nullable relation with null')
        }

        if (
          Array.isArray(document[relation.field]) &&
          document[relation.field].includes(null)
        ) {
          console.warn(`
          The relation "${relation.field}" of type "${relation.type}" contains null or undefined values.
          Null values are allowed for this relation type, but we don't store them.
          So they will be omitted from create document.
          `)
        }

        Object.defineProperty(document, relation.field, {
          value: documentsToRefCollection(
            document[relation.field]
              .filter(Boolean)
              .map((item: TypesMap[string]) => this.add(relation.type, item)),
          ),
        })
      } else {
        if (relation.isNullable && document[relation.field] == null) {
          continue
        }

        Object.defineProperty(document, relation.field, {
          value: documentToRef(
            this.add(relation.type, document[relation.field]),
          ),
        })
      }
    }

    return proxy(document, (target, prop) => {
      const field = Reflect.get(target, prop)

      if (isDocumentRefCollection(field)) {
        return this.resolveDocumentsFromRefCollection(field)
      }

      if (isDocumentRef(field)) {
        return this.resolveDocumentFromRef(field)
      }

      if (Reflect.has(target, prop) || typeof prop !== 'string') {
        return Reflect.get(target, prop)
      }
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
