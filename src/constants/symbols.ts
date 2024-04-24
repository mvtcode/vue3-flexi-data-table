import { VfField, VfType } from '@/interfaces/table';

export const symbols: VfField[] = [
  {
    vfTitle: '⌴',
    vfCode: 'space',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'space',
    vfActualFieldTitle: 'Dấu cách',
    value: '&nbsp;',
  },
  {
    vfTitle: '↩',
    vfCode: 'newline',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'newline',
    vfActualFieldTitle: 'NewLine',
    value: '<br/>',
  },
  {
    vfTitle: '-',
    vfCode: 'minus',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'minus',
    vfActualFieldTitle: 'Dấu trừ',
    value: '&hyphen;',
  },
  {
    vfTitle: '|',
    vfCode: 'vertical',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'vertical',
    vfActualFieldTitle: 'Dấu dọc',
    value: '&nbsp;|&nbsp;',
  },
  {
    vfTitle: ',',
    vfCode: 'comma',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'comma',
    vfActualFieldTitle: 'Dấu phẩy',
    value: ',&nbsp;',
  },
  {
    vfTitle: '.',
    vfCode: 'dot',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'dot',
    vfActualFieldTitle: 'Dấu chấm',
    value: '.&nbsp;',
  },
  {
    vfTitle: ';',
    vfCode: 'semicolon',
    vfType: VfType.SYMBOL,
    vfAcutalField: 'semicolon',
    vfActualFieldTitle: 'Chấm phẩy',
    value: ';&nbsp;',
  },
];

export const actions: VfField[] = [
  {
    vfTitle: 'Detail',
    vfCode: 'detail',
    vfType: VfType.ACTION,
    vfAcutalField: 'detail',
    vfActualFieldTitle: 'Detail',
    value: 'Detail',
  },
  {
    vfTitle: 'Update',
    vfCode: 'update',
    vfType: VfType.ACTION,
    vfAcutalField: 'update',
    vfActualFieldTitle: 'update',
    value: 'Update',
  },
  {
    vfTitle: 'Delete',
    vfCode: 'delete',
    vfType: VfType.ACTION,
    vfAcutalField: 'delete',
    vfActualFieldTitle: 'delete',
    value: 'Delete',
  },
];