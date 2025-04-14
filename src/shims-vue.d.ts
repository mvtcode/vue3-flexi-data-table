declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof import('element-plus')['ElButton']
    ElSelect: typeof import('element-plus')['ElSelect']
    ElOption: typeof import('element-plus')['ElOption']
    ElInput: typeof import('element-plus')['ElInput']
    ElIcon: typeof import('element-plus')['ElIcon']
  }
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ElButton: typeof import('element-plus')['ElButton']
    ElSelect: typeof import('element-plus')['ElSelect']
    ElOption: typeof import('element-plus')['ElOption']
    ElInput: typeof import('element-plus')['ElInput']
    ElIcon: typeof import('element-plus')['ElIcon']
  }

  interface ComponentCustomProperties {
    $refs: {
      [key: string]: any
    }
  }
}

declare module '@vue/runtime-dom' {
  export interface HTMLAttributes {
    class?: any
    style?: any
  }
}

declare module '@vue/composition-api' {
  export * from 'vue'
} 