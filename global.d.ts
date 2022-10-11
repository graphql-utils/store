declare module '*.graphql' {
  const schema: import('graphql').DocumentNode

  export default schema
}
