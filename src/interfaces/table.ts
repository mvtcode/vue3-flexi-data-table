import type { CSSProperties } from 'vue';

export enum VfType {
  DATA = "DATA",
  SYMBOL = "SYMBOL",
  ACTION = "ACTION",
  ICON = "ICON",
  LABEL = "LABEL",
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
    calFunc: string
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
  style?: CSSProperties;
}

export interface LayoutTemplate {
  title: string;
  id: string;
  isSystem: boolean;
  isDefault?: boolean;
  columns: Column[];
  labels?: LabelField[];
}

export interface Column {
  title: string;
  fieldCodes: string[];
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
  vAlign?: "top" | "middle" | "bottom";
  cssHeader?: string;
  cssValue?: string;
  isDrag?: boolean;
}
