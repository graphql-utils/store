export function proxy<T extends object>(
  target: T,
  getter: ProxyHandler<T>['get'],
): T {
  return new Proxy(target, {
    get: getter,

    defineProperty() {
      throw new Error('Documents are immutable.')
    },

    set() {
      throw new Error('Documents are immutable.')
    },
  })
}
