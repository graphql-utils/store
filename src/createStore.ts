import { Schema } from './types'
import { Store } from './Store'
import { resolveGraphQLSchema } from './schema'

interface CreateStoreOptions {
  schema: Schema
}

export function createStore<TypesMap extends Record<string, any>>(
  options: CreateStoreOptions,
) {
  return new Store<TypesMap>({
    schema: resolveGraphQLSchema(options.schema),
  })
}
