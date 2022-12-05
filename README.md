<br/>

<h1 align='center'>@graphql-utils/store</h1>

<p align='center'>In-memory data store for writing stateful GraphQL mocks.</p>

<br/>

> Warning: This library is still in early development and the API is subject to
> change. Use at your own risk.

## Introduction

`@graphql-utils/store` is an in-memory data store for writing stateful GraphQL
mocks. It uses your GraphQL schema to validate data and establish relations
between different types. It is handy for testing client-side applications that
rely on GraphQL APIs and allows you to mimic your API's real-world behavior. It
lets you write cleaner tests by decoupling API mocks from test cases.

### Features

- Immutable
- Synchronous
- Written in typescript
- Supports types relations
- Works in any Javascript environment (Browser, Node, Deno, etc.)
- Validates data against your GraphQL schema (soon)
- Mutation Events (soon)
- Mutation Hooks (soon)

Check out the [documentation](https://graphql-utils.vercel.app/store/) to learn
more.

## License

Distributed under the [MIT license](/LICENSE.md).
