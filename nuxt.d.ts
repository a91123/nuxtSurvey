declare module '#app' {
  interface NuxtApp {}
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $fetch: typeof $fetch
  }
}

export {}


