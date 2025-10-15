import type { CSSProperties } from 'vue';
import type { ColumnType, VfType } from '../enums/table.enum';

export interface LabelStyle extends CSSProperties {
  widthUnit?: string;
}

export interface VfField {
  vfTitle: string;
  vfCode: string;
  vfType: VfType;
  vfAcutalField?: string;
  vfActualFieldTitle?: string;
  vfRenderFunc?: (
    row: any,
    column: VfField,
    index: number,
    calFunc: string,
    value?: any
  ) => string;
  enum?: { [key: string]: string | number };
  value?: string;
  templateShow?: string;
  meta?: {[key: string]: any}
}

export interface VariantsField {
  title: string;
  field: string;
  variants: VfField[];
}

export interface LabelField {
  title: string;
  code: string;
  style?: LabelStyle;
}

export interface LayoutTemplate {
  title: string;
  id: string;
  isSystem: boolean;
  isDefault?: boolean;
  columns: Column[];
  labels?: LabelField[];
}

export interface SortConfig {
  field: string; // vfActualField hoặc vfActualFieldTitle để sort
  direction?: 'asc' | 'desc';
}

export interface Column {
  title: string;
  fieldCodes: string[];
  isDrag?: boolean;
  type?: ColumnType;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sortField?: string;
}

export interface LabelPreset {
  name: string;
  style: {
    color: string;
    backgroundColor: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
  }
}