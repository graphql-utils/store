import gql from 'graphql-tag'
import { buildSchema, GraphQLSchema, Kind } from 'graphql'
import { Store } from '../src'

const schema = `
  type Post {
    id: ID!
    title: String!
    body: String!
  }
  
  type User {
    id: ID!
    username: String!
    posts: [Post]!
  }
  
  type Query {
    user(id: ID!): User
  }
`

it('should accept `GraphQLSchema` object', () => {
  const graphqlSchema = buildSchema(schema)

  expect(graphqlSchema).toBeInstanceOf(GraphQLSchema)
  expect(() => new Store({ schema: graphqlSchema })).not.toThrowError()
})

it('should accept `DocumentNode` object', () => {
  const documentNode = gql(schema)

  expect(documentNode.kind).toEqual(Kind.DOCUMENT)
  expect(() => new Store({ schema: documentNode })).not.toThrowError()
})

it('should accept raw `string` schema', () => {
  expect(schema).toBeTypeOf('string')
  expect(() => new Store({ schema })).not.toThrowError()
})

it('should throw error if invalid schema provided', () => {
  // @ts-expect-error test for invalid schema
  expect(() => new Store({ schema: 1234 })).toThrowError(
    /Error: Invalid schema provided./,
  )
})
