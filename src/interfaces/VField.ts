export interface VField {
  vfCode: string
  vfTitle: string
  vfType: string
  vfAcutalField?: string
  vfActualFieldTitle?: string
  value?: string
  variants?: VField[]
  field?: string
  title?: string
  vfRenderFunc?: (value: any) => string
  templateShow?: string
  enum?: { [key: string]: string }
}

export interface VariantsField {
  title: string
  field: string
  variants: VField[]
} 