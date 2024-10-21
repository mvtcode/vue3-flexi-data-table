<template>
  <div
    class="wrapper-table custom-scroll"
    :class="{ fixed: fixed }"
    :style="{ height: fixed ? `${height}px` : 'auto' }"
  >
    <el-table
      border
      :data="data"
      :height="fixed ? height : undefined"
      style="width: 100%"
    >
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.fieldCodes[0]"
        :label="column.title"
        :width="column.width"
        :min-width="column.minWidth"
        :max-width="column.maxWidth"
        :align="column.align || 'left'"
        :header-align="column.align || 'left'"
      >
      <template #header="scope">
          <div :class="{ 'drag-over': column.isDrag }">
            {{ scope.column.label }}
          </div>
        </template>
        <template #default="scope">
          <div  v-html="getValue(scope.row, column, scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, onMounted, ref, onBeforeUnmount } from "vue";
import { Column, VfField, VfType } from "@/interfaces/table";
import { symbols } from "@/constants/symbols";
import escapeHtml from "escape-html";
import "@/assets/style.scss";

interface Props {
  columns: Column[];
  templates: VfField[];
  data: any[];
  height: number;
  fixed: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fixed: false,
});

interface FlattenedObject {
  [key: string]: any;
}

const emit = defineEmits<{
  (e: "onCta", action: string, row: any, index: number): void;
}>();

const prefixFunction = "tdac";
const callFunction = ref("");

onMounted(() => {
  callFunction.value = `${prefixFunction}${Math.floor(Math.random() * 1e6)}`;
  const w: any = window;
  w[callFunction.value] = function (action: string, index: number) {
    const row = props.data[index];
    emit("onCta", action, row, index);
  };
});

onBeforeUnmount(() => {
  const w: any = window;
  if (w[callFunction.value]) {
    w[callFunction.value] = undefined;
    delete w[callFunction.value];
  }
});

function flattenObject(
  obj: any,
  parentKey: string = "",
  result: FlattenedObject = {}
): FlattenedObject {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const prefixedKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], prefixedKey, result);
      } else {
        result[prefixedKey] = obj[key];
      }
    }
  }
  return result;
}

const render = (template: string, values: { [key: string]: any }): string => {
  return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
    const value = values[key];
    return value !== undefined && value !== null ? value : match;
  });
};
const mapFieldInfo = computed(() => {
  return [...props.templates, ...symbols].reduce(
    (map: { [vfCode: string]: VfField }, field: VfField) => {
      map[field.vfCode] = field;
      return map;
    },
    {}
  );
});

const getValue = computed(() => {
  return (row: any, column: Column, index: number) => {
    const values: string[] = [];
    for (const vfCode of column.fieldCodes) {
      const fieldInfo = mapFieldInfo.value[vfCode];
      if (fieldInfo) {
        if (fieldInfo.vfType === VfType.SYMBOL) {
          values.push(fieldInfo?.value || "");
          continue;
        }

        if (fieldInfo.vfType === VfType.TEXT) {
          const value = `<span style="
            color: ${fieldInfo.color || '#606266'};
            font-weight: ${fieldInfo.fontStyle?.includes('bold') ? 'bold' : 'normal'};
            font-style: ${fieldInfo.fontStyle?.includes('italic') ? 'italic' : 'normal'};
            text-decoration: ${fieldInfo.fontStyle?.includes('underline') ? 'underline' : ''} 
                             ${fieldInfo.fontStyle?.includes('line-through') ? 'line-through' : ''} 
                             ${fieldInfo.fontStyle?.includes('overline') ? 'overline' : ''};
          ">${fieldInfo.vfTitle}</span>`;
          values.push(value);
          continue;
        }

        if (fieldInfo.vfType === VfType.ACTION) {
          const value = `<span class="btn btn-${
            fieldInfo.vfAcutalField
          }" onClick="${callFunction.value}('${fieldInfo.vfCode}', ${index})">${
            fieldInfo?.vfTitle || ""
          }</span>`;
          values.push(value);
          continue;
        }
        
        
        if (fieldInfo.vfType === VfType.ICON) {
          const value = `<img class="icon" src="${fieldInfo.value}"/>`;
          values.push(value);
          continue;
        }

        if (fieldInfo.vfRenderFunc) {
          const vFun = fieldInfo.vfRenderFunc(
            row,
            fieldInfo,
            index,
            callFunction.value
          );
          values.push(vFun);
          continue;
        }

        const rowValue = row[fieldInfo.vfAcutalField as string];
        if (Array.isArray(rowValue)) {
          const vArr = fieldInfo.templateShow
            ? rowValue
                .map((item: any) =>
                  render(fieldInfo.templateShow as string, {
                    $item: escapeHtml(item),
                  })
                )
                .join("")
            : rowValue.join(", ");
          values.push(vArr);
          continue;
        }

        const objectRow = flattenObject(row);
        let value = objectRow[fieldInfo?.vfAcutalField || ""];
        if (fieldInfo?.enum && Object.keys(fieldInfo.enum).length > 0) {
          value = fieldInfo.enum[value] || value;
          value = escapeHtml(value);
        }

        if (fieldInfo?.templateShow) {
          value = render(fieldInfo?.templateShow, { value: escapeHtml(value) });
        }

        values.push(value);
      }
    }
    return values.join("");
  };
});
</script>

<style lang="scss" scoped>
.drag-over {
  color: red;
}
:deep(.el-table th.el-table__cell) {
  background-color: #ebeef5;
}
:deep(.el-table .cell) {
  color: rgb(96, 98, 102);
}

</style>
