export interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  type?: string
  formatter?: (row: any, column: TableColumn, cellValue: any) => any
}

export interface TableLayout {
  id: string
  title: string
  columns: TableColumn[]
  isDefault?: boolean
  isSystem?: boolean
}

export interface TableAction {
  id: string
  name: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  disabled?: boolean
  show?: boolean
  handler?: (row: any) => void
}

export interface LayoutTemplateEdit extends TableLayout {
  isSave: boolean
} 