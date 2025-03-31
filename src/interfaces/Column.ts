import type { VField } from './VField'

export interface Column {
  title: string
  fieldCodes: string[]
  align?: 'left' | 'center' | 'right'
  vAlign?: 'top' | 'middle' | 'bottom'
  width?: string
  minWidth?: string
  maxWidth?: string
  isDrag?: boolean
} 