<template>
  <div class="wrapper-table custom-scroll" :class="{fixed: fixed}" :style="{height: fixed ? `${height}px`: 'auto'}">
    <table class="dynamic-table">
      <thead>
        <tr >
          <th v-for="(column, index) in columns" :key="index" :class="{'drag-over': column.isDrag}"> {{ column.title }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="(data?.length || 0) > 0">
          <tr v-for="(row, index) in data" :key="index">
            <td v-for="(column, index2) in columns" :key="index2" :class="{'drag-over': column.isDrag}" :style="getStyleColumn(column)">
              <div class="td-line" v-html="getValue(row, column, index)" />
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="columns.length" class="no-data">
            <slot name="no-data">
              Không có dữ liệu
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, ref, onBeforeUnmount, CSSProperties } from "vue";
import { Column, LabelField, VfField, VfType } from '@/interfaces/table';
import { symbols } from '@/constants/symbols';
import escapeHtml from 'escape-html';

import '@/assets/style.scss';

interface Props {
  columns: Column[];
  templates: VfField[];
  labels: LabelField[];
  data: any[] | undefined;
  height?: number;
  fixed: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  templates: () => [],
  labels: () => [],
  data: () => [],
  fixed: false,
});

interface FlattenedObject {
  [key: string]: any;
}

const emit = defineEmits<{
  (e: "onCta", action: string, row: any, index: number): void;
}>();

const prefixFunction = 'tdac';
const callFunction = ref('');

onMounted(() => {
  callFunction.value = `${prefixFunction}${Math.floor(Math.random() * 1e6)}`;
  const w: any = window;
  w[callFunction.value] = function (action: string, index: number) {
    const row = props.data[index];
    row && emit('onCta', action, row, index);
  }
});

onBeforeUnmount(() => {
  const w: any = window;
  if (w[callFunction.value]) {
    w[callFunction.value] = undefined;
    delete w[callFunction.value];
  }
})

const flattenObject = computed(() => {
  return (obj: any, parentKey: string = '', result: FlattenedObject = {}): FlattenedObject => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const prefixedKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject.value(obj[key], prefixedKey, result);
        } else {
          result[prefixedKey] = obj[key];
        }
      }
    }
    return result;
  }
});

const render = (template: string, values: {[key: string]: any}): string => {
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const value = values[key];
    return (value !== undefined && value !== null) ? value : match;
  });
}

const getStyleColumn = computed(() => {
  return (column: Column) => {
    const style: {[key: string]: string} = {
      'text-align': (column.align || 'left'),
      'vertical-align': (column.vAlign || 'top')
    }
    column.width && (style.width = column.width);
    column.minWidth && (style['min-width'] = column.minWidth);
    column.maxWidth && (style['max-width'] = column.maxWidth);
    return style;
  }
});

const mapFieldInfo = computed<{[code: string]: VfField}>(() => {
  return [
    ...props.templates,
    ...props.labels.map((label: LabelField) => {
      return {
        vfTitle: label.title,
        vfCode: label.code,
        vfType: VfType.LABEL,
        meta: label.style
      } as VfField
    }),
    ...symbols
  ].reduce((map: {[vfCode: string]: VfField}, field: VfField) => {
    map[field.vfCode] = field;
    return map;
  }, {});
});

const getStyleLabel = computed(() => (field: VfField): string => {
  const label = props.labels.find(label => label.code === field.vfCode)
  const style: CSSProperties = label?.style || {}
  const styleEntries = Object.entries(style).map(([key, value]) => {
    // Chuyển đổi từ camelCase sang kebab-case
    const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    return `${cssKey}: ${value}`;
  })
  
  if (style.backgroundColor && style.backgroundColor !== 'transparent') {
    styleEntries.push('padding: 0 3px');
    styleEntries.push('border-radius: 3px');
  }

  return styleEntries.join(';');
})

const getValue = computed(() => {
  return (row: any, column: Column, index: number) => {
    const values: string[] = [];
    for(const vfCode of column.fieldCodes) {
      const fieldInfo = mapFieldInfo.value[vfCode];
      if (fieldInfo) {
        switch (fieldInfo.vfType) {
          case VfType.SYMBOL:
            values.push(fieldInfo?.value || '');
            break;

          case VfType.ACTION:
            if (fieldInfo.vfRenderFunc) {
              const vFun = fieldInfo.vfRenderFunc(row, fieldInfo, index, callFunction.value);
              const span = document.createElement("span");
              span.classList.add('btn');
              span.classList.add(`btn-${fieldInfo.vfCode}`);
              span.setAttribute('onClick', `${callFunction.value}('${fieldInfo.vfCode}', ${index})`);
              span.textContent = vFun;
              values.push(span.outerHTML);
              break;
            }

            if (fieldInfo.vfAcutalField) {
              const objectRow = flattenObject.value(row);
              const value = objectRow[fieldInfo?.vfAcutalField || ''];
              const span = document.createElement("span");
              span.classList.add('btn');
              span.classList.add(`btn-${fieldInfo.vfCode}`);
              span.setAttribute('onClick', `${callFunction.value}('${fieldInfo.vfCode}', ${index})`);
              span.textContent = value || '';
              values.push(span.outerHTML);
              break;
            }

            const spanx = document.createElement("span");
            spanx.classList.add('btn');
            spanx.classList.add(`btn-${fieldInfo.vfCode}`);
            spanx.setAttribute('onClick', `${callFunction.value}('${fieldInfo.vfCode}', ${index})`);
            spanx.textContent = fieldInfo?.vfTitle || '';
            values.push(spanx.outerHTML);
            break;

          case VfType.ICON:
            const img = document.createElement("img");
            img.classList.add('icon');
            img.src = fieldInfo.value || '';
            values.push(img.outerHTML);
            break;

          case VfType.LABEL:
            const span = document.createElement("span");
            span.style.cssText = getStyleLabel.value(fieldInfo);
            span.textContent = fieldInfo.vfTitle;
            values.push(span.outerHTML);
            break;

          default:
            const objectRow = flattenObject.value(row);
            let value = objectRow[fieldInfo?.vfAcutalField || ''];

            if (fieldInfo.vfRenderFunc) {
              const vFun = fieldInfo.vfRenderFunc(row, fieldInfo, index, callFunction.value, structuredClone(value));
              values.push(vFun);
              break;
            }

            const rowValue = row[fieldInfo.vfAcutalField as string];
            if(Array.isArray(rowValue)) {
              const vArr = fieldInfo.templateShow ? rowValue.map((item: any) => render(fieldInfo.templateShow as string, {$item: escapeHtml(item)})).join('') : rowValue.join(', ');
              values.push(vArr);
              break;
            }

            if (fieldInfo?.enum && Object.keys(fieldInfo.enum).length > 0) {
              value = fieldInfo.enum[value] || value;
              value = escapeHtml(value);
            }

            if (fieldInfo?.templateShow) {
              value = render(fieldInfo?.templateShow, {value: escapeHtml(value)});
            }

            values.push(value);
            break;
        }
      }
    }
    return values.join('');
  }
});
</script>

<style lang="scss" scoped>
.drag-over {
  color: #F00;
}

.icon {
  height: 18px;
}
</style>