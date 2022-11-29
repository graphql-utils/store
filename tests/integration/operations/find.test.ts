import { Store } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { postFactory, userFactory } from '../../utils/factories'
import { isTextContent, toCollection } from '../../utils'

const store = new Store<TypesMap>({
  schema,
})

afterEach(() => store.reset())

it('should retrieve all documents for a type', () => {
  const users = toCollection(() => store.add('User', userFactory()), 5)
  const posts = toCollection(() => store.add('Post', postFactory()), 5)

  expect(store.find('User')).toHaveLength(10)
  expect(store.find('User')).toEqual([
    ...users,
    ...posts.map((post) => post.author),
  ])

  expect(store.find('Post')).toHaveLength(5)
  expect(store.find('Post')).toEqual(posts)
})

it('should return an empty array if no documents exist', () => {
  expect(store.find('User')).toHaveLength(0)
  expect(store.find('User')).toEqual([])

  expect(store.find('Post')).toHaveLength(0)
  expect(store.find('Post')).toEqual([])
})

it('can filter documents using a predicate function', () => {
  toCollection(() => store.add('User', userFactory()), 5)
  toCollection(() => store.add('Post', postFactory()), 5)

  const users = [
    store.add('User', userFactory({ username: 'john.doe' })),
    store.add('User', userFactory({ username: 'john.mark' })),
    store.add('User', userFactory({ username: 'john.luck' })),
  ]

  const posts = [
    store.add(
      'Post',
      postFactory({ content: { text: 'Javascript: Getting Started' } }),
    ),
    store.add(
      'Post',
      postFactory({ content: { text: 'Javascript: Variables' } }),
    ),
    store.add(
      'Post',
      postFactory({ content: { text: 'Javascript: Conditionals' } }),
    ),
  ]

  expect(store.count('User')).toEqual(16)
  expect(store.count('Post')).toEqual(8)

  expect(
    store.find('User', (user) => {
      return user.username.startsWith('john.')
    }),
  ).toEqual(users)

  expect(
    store.find('Post', (post) => {
      if (isTextContent(post.content)) {
        return post.content.text.startsWith('Javascript: ')
      }

      return false
    }),
  ).toEqual(posts)
})
