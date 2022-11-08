import { PostContent, Text } from '../fixtures/schema.types'

export function toCollection<T>(callback: () => T, times: number) {
  return Array.from({ length: times }, () => callback())
}

export function isTextContent(content: PostContent): content is Text {
  return Reflect.has(content, 'text')
}
