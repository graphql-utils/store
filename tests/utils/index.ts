export function toCollection<T>(callback: () => T, times: number) {
  return Array.from({ length: times }, () => callback())
}
