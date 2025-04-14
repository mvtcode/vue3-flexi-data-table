import { DefineComponent } from 'vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ElButton: DefineComponent<{
      type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
      disabled?: boolean
      onClick?: (e: MouseEvent) => void
      class?: string
    }>
    ElSelect: DefineComponent<{
      modelValue?: any
      disabled?: boolean
      onChange?: (value: any) => void
      class?: string
    }>
    ElOption: DefineComponent<{
      value?: any
      label?: string
      class?: string
    }>
    ElIcon: DefineComponent<{
      class?: string
    }>
  }

  export interface IntrinsicElements {
    div: any
    span: any
    h4: any
    h5: any
    hr: any
    input: any
    button: any
    img: any
    ul: any
    li: any
    label: any
    template: any
  }
} 