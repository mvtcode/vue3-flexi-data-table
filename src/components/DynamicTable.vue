<template>
  <el-table
    ref="tableRef"
    border
    :data="data"
    :height="fixed ? height : undefined"
    style="width: 100%"
    @sort-change="handleSortChange"
    @selection-change="handleSelectionChange"
  >
    <template v-for="(column, index) in columns" :key="`${index}-${column.type}`">
      <el-table-column
        type="selection"
        width="45"
        align="center"
        header-align="center"
        v-if="column.type === ColumnType.SELECT"
      />

      <el-table-column
        v-else
        :key="index"
        :prop="column.sortField"
        :label="column.title"
        :sortable="!!column.sortField"
        :sort-orders="['ascending', 'descending', null]"
        :sort-by="column.sortField"
      >
        <template #default="{ row, $index }">
          <div v-html="getValue(row, column, $index)" />
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, ref, onBeforeUnmount, CSSProperties, defineExpose } from "vue";
import { Column, LabelField, VfField, VfType, LabelStyle, ColumnType } from '@/interfaces/table';
import { symbols } from '@/constants/symbols';
import escapeHtml from 'escape-html';
import DOMPurify from 'dompurify';
import type { TableInstance } from 'element-plus';

import '@/assets/style.scss';

interface Props {
  columns: Column[];
  templates: VfField[];
  labels: LabelField[];
  data: any[];
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
  (e: "selectChange", selectedRows: number[]): void;
  (e: "sortChange", sort: { field?: string; direction?: 'asc' | 'desc' }): void;
}>();

const prefixFunction = 'tdac';
const callFunction = ref('');

// Định nghĩa event handler function
const handleActionClick = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.hasAttribute('data-action')) {
    const action = target.getAttribute('data-action');
    const index = parseInt(target.getAttribute('data-index') || '-1', 10);
    if (action && index >= 0) {
      const row = props.data[index];
      row && emit('onCta', action, row, index);
    }
  }
};

onMounted(() => {
  callFunction.value = `${prefixFunction}${Math.floor(Math.random() * 1e6)}`;
  const w: any = window;
  w[callFunction.value] = function (action: string, index: number) {
    const row = props.data[index];
    row && emit('onCta', action, row, index);
  }

  // Add event listener for actions
  document.addEventListener('click', handleActionClick);
});

onBeforeUnmount(() => {
  const w: any = window;
  if (w[callFunction.value]) {
    w[callFunction.value] = undefined;
    delete w[callFunction.value];
  }
  
  // Remove event listener
  document.removeEventListener('click', handleActionClick);
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
      'text-align': column.align || 'left',
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
  const style: LabelStyle = label?.style || {}
  const styleEntries = Object.entries(style).map(([key, value]) => {
    // Chuyển đổi từ camelCase sang kebab-case
    const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    
    // Xử lý đặc biệt cho width
    if (key === 'width' && value !== 'auto' && style.widthUnit) {
      return `${cssKey}: ${value}${style.widthUnit}; display: inline-block;`;
    }
    
    return `${cssKey}: ${value}`;
  })
  
  if (style.backgroundColor && style.backgroundColor !== 'transparent') {
    styleEntries.push('padding: 0 3px');
    styleEntries.push('border-radius: 3px');
  }

  return styleEntries.join(';');
})

// Cấu hình DOMPurify
const sanitizeConfig = {
  ALLOWED_TAGS: ['div', 'span', 'img', 'strong', 'b', 'i', 'em', 'br', 'p', 'a'],
  ALLOWED_ATTR: [
    'class', 'style', 'src', 'alt', 'title', 
    'data-action', 'data-index', 'href',
    'onclick'
  ],
  ADD_ATTR: ['target', 'rel'],
  ALLOW_DATA_ATTR: true,
  ALLOW_UNKNOWN_PROTOCOLS: true,
  KEEP_CONTENT: true,
};

// Hàm decode HTML entities
const decodeHtmlEntities = (str: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// Hàm xử lý HTML content
const processHtmlContent = (html: any): string => {
  if (typeof html !== 'string') {
    return String(html);
  }
  
  // Chỉ thay thế các ký tự đặc biệt khác, giữ nguyên &nbsp; và |
  const processed = html
    .replace(/&hyphen;/g, '-')
    .replace(/&vert;/g, '|');
  
  return DOMPurify.sanitize(processed, {
    ...sanitizeConfig,
    ALLOW_ARIA_ATTR: true,
  });
};

// Hàm escape text an toàn
const safeEscapeText = (text: string): string => {
  if (typeof text !== 'string') {
    return String(text);
  }
  return escapeHtml(decodeHtmlEntities(text));
};

const getValue = computed(() => {
  return (row: any, column: Column, index: number) => {
    const values: string[] = [];
    for(const vfCode of column.fieldCodes) {
      const fieldInfo = mapFieldInfo.value[vfCode];
      if (fieldInfo) {
        switch (fieldInfo.vfType) {
          case VfType.SYMBOL:
            values.push(processHtmlContent(fieldInfo?.value || ''));
            break;

          case VfType.ACTION:
            if (fieldInfo.vfRenderFunc) {
              const vFun = fieldInfo.vfRenderFunc(row, fieldInfo, index, callFunction.value);
              const span = document.createElement("span");
              span.classList.add('btn-link', `btn-${fieldInfo.vfCode}`);
              span.setAttribute('data-action', fieldInfo.vfCode);
              span.setAttribute('data-index', String(index));
              span.innerHTML = processHtmlContent(vFun);
              values.push(span.outerHTML);
              break;
            }

            if (fieldInfo.vfAcutalField) {
              const objectRow = flattenObject.value(row);
              const value = objectRow[fieldInfo?.vfAcutalField || ''];
              const span = document.createElement("span");
              span.classList.add('btn-link', `btn-${fieldInfo.vfCode}`);
              span.setAttribute('data-action', fieldInfo.vfCode);
              span.setAttribute('data-index', String(index));
              span.innerHTML = processHtmlContent(value || '');
              values.push(span.outerHTML);
              break;
            }

            const spanx = document.createElement("span");
            spanx.classList.add('btn-link', `btn-${fieldInfo.vfCode}`);
            spanx.setAttribute('data-action', fieldInfo.vfCode);
            spanx.setAttribute('data-index', String(index));
            spanx.innerHTML = processHtmlContent(fieldInfo?.vfTitle || '');
            values.push(spanx.outerHTML);
            break;

          case VfType.ICON:
            const img = document.createElement("img");
            img.classList.add('icon');
            img.src = fieldInfo.value || '';
            img.alt = safeEscapeText(fieldInfo.vfTitle || '');
            values.push(img.outerHTML);
            break;

          case VfType.LABEL:
            const span = document.createElement("span");
            span.style.cssText = getStyleLabel.value(fieldInfo);
            span.innerHTML = processHtmlContent(fieldInfo.vfTitle);
            values.push(span.outerHTML);
            break;

          default:
            const objectRow = flattenObject.value(row);
            let value = objectRow[fieldInfo?.vfAcutalField || ''];

            if (fieldInfo.vfRenderFunc) {
              const vFun = fieldInfo.vfRenderFunc(row, fieldInfo, index, callFunction.value, structuredClone(value));
              values.push(processHtmlContent(vFun));
              break;
            }

            const rowValue = row[fieldInfo.vfAcutalField as string];
            if(Array.isArray(rowValue)) {
              const vArr = fieldInfo.templateShow 
                ? rowValue.map((item: any) => {
                    return render(fieldInfo.templateShow as string, {
                      $item: processHtmlContent(item)
                    });
                  }).join('') 
                : rowValue.map(item => safeEscapeText(item)).join('|');
              values.push(processHtmlContent(vArr));
              break;
            }

            if (fieldInfo?.enum && Object.keys(fieldInfo.enum).length > 0) {
              value = fieldInfo.enum[value] || value;
            }

            if (fieldInfo?.templateShow) {
              value = render(fieldInfo?.templateShow, {
                value: processHtmlContent(value)
              });
              values.push(value);
            } else {
              values.push(safeEscapeText(value));
            }
            break;
        }
      }
    }
    return values.join('');
  }
});

const hasSelectColumn = computed(() => {
  return props.columns.some(column => column.type === ColumnType.SELECT);
});

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  emit('sortChange', {
    field: prop,
    direction: order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : undefined
  });
};

const handleSelectionChange = (selection: any[]) => {
  const selectedIndexes = selection.map(item => props.data?.indexOf(item) || -1).filter(index => index !== -1);
  emit('selectChange', selectedIndexes);
};

const tableRef = ref<TableInstance>();

// Expose methods
defineExpose({
  getSelect: () => {
    if (!tableRef.value) return [];
    const selection = tableRef.value.getSelectionRows();
    return selection.map(row => props.data?.indexOf(row) || -1).filter(index => index !== -1);
  },
  setSelect: (indexes: number[]) => {
    if (!tableRef.value) return;
    const rows = props.data?.filter((_, index) => indexes.includes(index)) || [];
    tableRef.value.setSelectionRows(rows);
    emit('selectChange', indexes);
  },
  clearSelect: () => {
    if (!tableRef.value) return;
    tableRef.value.clearSelection();
    emit('selectChange', []);
  }
});
</script>

<style lang="scss" scoped>
// .btn-link {
//   cursor: pointer;
//   color: #007bff;
//   text-decoration: underline;
//   &:hover {
//     color: #0056b3;
//     text-decoration: none;
//   }
// }
</style>

<style lang="scss">
.btn-link {
  cursor: pointer;
  color: #007bff;
  text-decoration: none;
  &:hover {
    color: #0056b3;
  }
}

.icon {
  width: 16px;
  height: 16px;
}
</style>