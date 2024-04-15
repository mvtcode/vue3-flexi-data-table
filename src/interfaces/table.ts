export enum VfType {
  DATA = 'DATA',
  SYMBOL = 'SYMBOL',
  ACTION = 'ACTION',
  ICON = 'ICON',
}

export interface VfField {
  vfTitle: string;
  vfCode: string;
  vfType: VfType;
  vfAcutalField?: string;
  vfActualFieldTitle?: string;
  vfRenderFunc?: (row: any, column: VfField, index: number, calFunc: string) => string;
  enum?: {[key: string]: string | number};
  value?: string;
  templateShow?: string;
}

export interface VariantsField {
  title: string;
  field: string;
  variants: VfField[];
}

export interface Column {
  title: string;
  fieldCodes: string[];
  width?: string;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
  cssHeader?: string;
  cssValue?: string;

  isDrag?: boolean;
}
