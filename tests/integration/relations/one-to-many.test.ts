import { Store } from '../../../src'
import { schema, TypesMap } from '../../fixtures'
import { toCollection } from '../../utils'
import {
  commentFactory,
  postFactory,
  profileFactory,
  tagFactory,
  userFactory,
} from '../../utils/factories'

const store = new Store<TypesMap>({
  schema,
})

beforeEach(() => {
  store.reset()
  vi.resetAllMocks()
})

describe('create', () => {
  it('can add new document with `[type!]!` relation', () => {
    const data = profileFactory({
      posts: {
        count: 2,
        edges: toCollection(
          () => ({ cursor: 'cursor', node: postFactory() }),
          2,
        ),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const profile = store.add('Profile', data)
    const retrievedProfile = store.findFirstOrThrow(
      'Profile',
      ({ username }) => username === data.username,
    )

    expect(profile.posts.edges).toEqual(data.posts.edges)
    expect(retrievedProfile.posts.edges).toEqual(data.posts.edges)
    expect(store.count('Post')).toEqual(2)
    expect(store.find('Post')).toEqual(
      profile.posts.edges.map(({ node }) => node),
    )
  })

  it('can add new document with `[type!]!` relation and an empty list', () => {
    const data = profileFactory({
      posts: {
        count: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const profile = store.add('Profile', data)
    const retrievedProfile = store.findFirstOrThrow(
      'Profile',
      ({ username }) => username === data.username,
    )

    expect(profile.posts.edges).toEqual(data.posts.edges)
    expect(retrievedProfile.posts.edges).toEqual(data.posts.edges)
    expect(store.count('Post')).toEqual(0)
    expect(store.find('Post')).toEqual([])
  })

  it('should throw error when adding a new document with `[type!]! relation and null list', () => {
    expect(() => {
      store.add(
        'Profile',
        profileFactory({
          posts: {
            count: 0,
            // @ts-expect-error - null is not assignable to `PostEdge[]`
            edges: null,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('should throw error when adding a new document with `[type!]! relation and undefined list', () => {
    expect(() => {
      store.add(
        'Profile',
        profileFactory({
          posts: {
            count: 0,
            // @ts-expect-error - null is not assignable to `PostEdge[]`
            edges: undefined,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('can add new document with `[type]!` relation', () => {
    const data = profileFactory({
      followers: {
        count: 0,
        edges: toCollection(
          () => ({ cursor: 'cursor', node: userFactory() }),
          2,
        ),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const profile = store.add('Profile', data)
    const retrievedProfile = store.findFirstOrThrow(
      'Profile',
      ({ username }) => username === data.username,
    )

    expect(profile.followers).toEqual(data.followers)
    expect(retrievedProfile.followers).toEqual(data.followers)
    expect(store.count('User')).toEqual(2)
    expect(store.find('User')).toEqual(
      profile.followers.edges.map((edge) => edge?.node),
    )
  })

  it('can add new document with `[type]!` relation and an empty list', () => {
    const data = profileFactory({
      followers: {
        count: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const profile = store.add('Profile', data)
    const retrievedProfile = store.findFirstOrThrow(
      'Profile',
      ({ username }) => username === data.username,
    )

    expect(profile.followers).toEqual(data.followers)
    expect(retrievedProfile.followers).toEqual(data.followers)
    expect(store.count('User')).toEqual(0)
    expect(store.find('User')).toEqual([])
  })

  it('can add new document with `[type]!` relation with null values', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {
      /**/
    })

    const data = profileFactory({
      followers: {
        count: 0,
        edges: [
          null,
          { cursor: 'cursor', node: userFactory() },
          null,
          { cursor: 'cursor', node: userFactory() },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const profile = store.add('Profile', data)
    const retrievedProfile = store.findFirstOrThrow(
      'Profile',
      ({ username }) => username === data.username,
    )

    data.followers.edges = data.followers.edges.filter((edge) => edge !== null)

    expect(profile.followers).toEqual(data.followers)
    expect(retrievedProfile.followers).toEqual(data.followers)
    expect(store.count('User')).toEqual(2)
    expect(store.find('User')).toEqual(
      profile.followers.edges.map((edge) => edge?.node),
    )

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining(
        'The relation "edges" of type "UserEdge" contains null or undefined values',
      ),
    )
  })

  it('should throw error when adding a new document with `[type]! relation and null list', () => {
    expect(() => {
      store.add(
        'Profile',
        profileFactory({
          followers: {
            count: 0,
            // @ts-expect-error - null is not assignable to `Maybe<UserEdge>[]`
            edges: null,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('should throw error when adding a new document with `[type]! relation and undefined list', () => {
    expect(() => {
      store.add(
        'Profile',
        profileFactory({
          followers: {
            count: 0,
            // @ts-expect-error - null is not assignable to `Maybe<UserEdge>[]`
            edges: undefined,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('can add new document with `[type!]` relation', () => {
    const data = postFactory({
      comments: {
        count: 0,
        edges: toCollection(
          () => ({ cursor: 'cursor', node: commentFactory() }),
          2,
        ),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.comments).toEqual(data.comments)
    expect(retrievedPost.comments).toEqual(data.comments)
    expect(store.count('Comment')).toEqual(2)
    expect(store.find('Comment')).toEqual(
      post.comments.edges?.map((edge) => edge?.node),
    )
  })

  it('can add new document with `[type!]` relation and an empty list', () => {
    const data = postFactory({
      comments: {
        count: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.comments).toEqual(data.comments)
    expect(retrievedPost.comments).toEqual(data.comments)
    expect(store.count('Comment')).toEqual(0)
    expect(store.find('Comment')).toEqual([])
  })

  it('can add new document with `[type!]` relation and null list', () => {
    const data = postFactory({
      comments: {
        count: 0,
        edges: null,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.comments).toEqual(data.comments)
    expect(post.comments.edges).toEqual(null)
    expect(retrievedPost.comments).toEqual(data.comments)
    expect(store.count('Comment')).toEqual(0)
    expect(store.find('Comment')).toEqual([])
  })

  it('can add new document with `[type!]` relation and undefined list', () => {
    const data = postFactory({
      comments: {
        count: 0,
        edges: undefined,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.comments).toEqual(data.comments)
    expect(post.comments.edges).toEqual(undefined)
    expect(retrievedPost.comments).toEqual(data.comments)
    expect(store.count('Comment')).toEqual(0)
    expect(store.find('Comment')).toEqual([])
  })

  it('should throw error when adding a new document with `[type!]` relation and null values', () => {
    expect(() => {
      store.add(
        'Post',
        postFactory({
          comments: {
            count: 0,
            edges: [
              // @ts-expect-error - null is not assignable to `Maybe<CommentEdge[]>`
              null,
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('should throw error when adding a new document with `[type!]` relation and undefined values', () => {
    expect(() => {
      store.add(
        'Post',
        postFactory({
          comments: {
            count: 0,
            edges: [
              // @ts-expect-error - null is not assignable to `Maybe<CommentEdge[]>`
              undefined,
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        }),
      )
    }).toThrowError('Can not create a non-nullable relation with null')
  })

  it('can add a new document with `[type]` relation', () => {
    const data = postFactory({
      tags: {
        count: 2,
        edges: toCollection(
          () => ({ cursor: 'cursor', node: tagFactory() }),
          2,
        ),
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.tags).toEqual(data.tags)
    expect(retrievedPost.tags).toEqual(data.tags)
    expect(store.count('Tag')).toEqual(2)
    expect(store.find('Tag')).toEqual(
      post.tags.edges?.map((edge) => edge?.node),
    )
  })

  it('can add a new document with `[type]` relation and an empty list', () => {
    const data = postFactory({
      tags: {
        count: 0,
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.tags).toEqual(data.tags)
    expect(retrievedPost.tags).toEqual(data.tags)
    expect(store.count('Tag')).toEqual(0)
    expect(store.find('Tag')).toEqual([])
  })

  it('can add a new document with `[type]` relation and null list', () => {
    const data = postFactory({
      tags: {
        count: 0,
        edges: null,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.tags).toEqual(data.tags)
    expect(post.tags.edges).toEqual(null)
    expect(retrievedPost.tags).toEqual(data.tags)
    expect(store.count('Tag')).toEqual(0)
    expect(store.find('Tag')).toEqual([])
  })

  it('can add a new document with `[type]` relation and undefined list', () => {
    const data = postFactory({
      tags: {
        count: 0,
        edges: undefined,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    expect(post.tags).toEqual(data.tags)
    expect(post.tags.edges).toEqual(undefined)
    expect(retrievedPost.tags).toEqual(data.tags)
    expect(store.count('Tag')).toEqual(0)
    expect(store.find('Tag')).toEqual([])
  })

  it('can add a new document with `[type]` relation with null values', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {
      /**/
    })

    const data = postFactory({
      tags: {
        count: 0,
        edges: [
          null,
          { cursor: '', node: tagFactory() },
          null,
          { cursor: '', node: tagFactory() },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    })

    const post = store.add('Post', data)
    const retrievedPost = store.findFirstOrThrow(
      'Post',
      ({ id }) => id === data.id,
    )

    data.tags.edges = data.tags.edges?.filter((edge) => edge !== null)

    expect(post.tags).toEqual(data.tags)
    expect(retrievedPost.tags).toEqual(data.tags)
    expect(store.count('Tag')).toEqual(2)
    expect(store.find('Tag')).toEqual(
      post.tags.edges?.map((edge) => edge?.node),
    )

    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining(
        'The relation "edges" of type "TagEdge" contains null or undefined values',
      ),
    )
  })
})
