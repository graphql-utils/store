import { assertType, expectTypeOf } from 'vitest'
import type { Store } from '../../src'
import { createStore } from '../../src'
import { postFactory, userFactory } from '../utils/factories'
import { Post, schema, TypesMap, User } from '../fixtures'

const store = createStore<TypesMap>({
  schema,
})

test('TypesMap', () => {
  assertType<Store<TypesMap>>(store)

  // @ts-expect-error - 'TypesMap' should match
  assertType<Store<{ foo: 'bar' }>>(store)
})

test('add', () => {
  assertType<User>(store.add('User', userFactory()))
  assertType<Post>(store.add('Post', postFactory()))

  // @ts-expect-error - Return type should match
  assertType<Post>(store.add('User', userFactory()))

  expectTypeOf(store.add).parameter(0).toEqualTypeOf<keyof TypesMap>()
})

test('count', () => {
  assertType<number>(store.count('User'))
  assertType<number>(store.count('Post'))
})

test('findFirstOrThrow', () => {
  assertType<User>(store.findFirstOrThrow('User'))
  assertType<Post>(store.findFirstOrThrow('Post'))

  // @ts-expect-error - Return type should match
  assertType<Post>(store.findFirstOrThrow('User'))
})

test('findFirst', () => {
  assertType<User | undefined>(store.findFirst('User'))
  assertType<Post | undefined>(store.findFirst('Post'))

  // @ts-expect-error - Return type should match
  assertType<Post>(store.findFirst('User'))
})

test('find', () => {
  assertType<User[]>(store.find('User'))
  assertType<Post[]>(store.find('Post'))

  // @ts-expect-error - Return type should match
  assertType<Post[]>(store.find('User'))
})

test('update', () => {
  assertType<User>(store.update(store.findFirstOrThrow('User'), userFactory()))
  assertType<Post>(store.update(store.findFirstOrThrow('Post'), postFactory()))

  // @ts-expect-error - Return type should match
  assertType<Post>(store.update(store.findFirstOrThrow('User'), userFactory()))
})

test('delete', () => {
  assertType<boolean>(store.delete(store.findFirstOrThrow('User')))
})

test('clear', () => {
  assertType<void>(store.clear())
  expectTypeOf(store.clear).parameter(0).toEqualTypeOf<keyof TypesMap>()
})

test('reset', () => {
  assertType<void>(store.reset())
})
