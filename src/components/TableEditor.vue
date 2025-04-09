<template>
  <div class="dynamic-table-edit box box-grid" :style="{height: `${height}px`}">
    <div class="grid-col-2">
      <div class="edit-columns">
        <div class="justify-content-space-between">
          <h5> Columns </h5>
          <div>
            <button class="btn-plus" :disabled="disabled" @click="onAddColumn">✚</button>
          </div>
        </div>
        <hr style="margin: 5px 0"/>
        <draggable
          tag="ul"
          v-model="columnsEdit"
          handle=".handle"
          ghost-class="ghost"
          :sort="!disabled"
          class="dragArea list-group custom-scroll"
        >
          <li v-for="(element, index) in columnsEdit" :key="index" class="list-group-item" :class="{'hover': element.isDrag, active: activeIndex === index}" @click="!disabled && (activeIndex = index)">
            <div class="label align-items-center" @drop="e => onDrop(e, element, index)" @dragover="e => onDragover(e, element)" @dragleave="e => onDragleave(e, element)">
              <div class="align-items-center">
                <span class="handle">☰</span>

                <Popper placement="right-start" arrow class="popper-wrapper">
                  <button class="btn-more" :disabled="disabled">⋯</button>
                  <template #content>
                    <div class="popover-action">
                      <!-- Column type - Move to top -->
                      <div style="margin-bottom: 8px" class="div-input">
                        <label class="label">Column type:</label>
                        <select v-model="element.type" @change="handleColumnTypeChange(element)">
                          <option :value="ColumnType.DATA">Data</option>
                          <option :value="ColumnType.SELECT">Select</option>
                        </select>
                      </div>

                      <!-- Horizontal Align -->
                      <div>
                        <button class="btn-more" :class="{active: (element.align || 'left') === 'left'}" @click="element.align = 'left'">
                          <img :src="AlignLeftIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.align === 'center'}" @click="element.align = 'center'">
                          <img :src="AlignCenterIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.align === 'right'}" @click="element.align = 'right'">
                          <img :src="AlignRightIcon" />
                        </button>
                      </div>

                      <!-- Vertical Align -->
                      <div style="margin-top: 4px">
                        <button class="btn-more" :class="{active: (element.vAlign || 'top') === 'top'}" @click="element.vAlign = 'top'">
                          <img :src="VerticalAlignTopIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.vAlign === 'middle'}" @click="element.vAlign = 'middle'">
                          <img :src="VerticalAlignCenterIcon" />
                        </button>
                        <button class="btn-more" :class="{active: element.vAlign === 'bottom'}" @click="element.vAlign = 'bottom'">
                          <img :src="VerticalAlignBottomIcon" />
                        </button>
                      </div>

                      <!-- Width settings -->
                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">width:</label>
                        <input type="text" v-model="element.width" placeholder="# px | %"/>
                      </div>
                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">min-width:</label>
                        <input type="text" v-model="element.minWidth" placeholder="# px | %"/>
                      </div>
                      <div style="margin-top: 4px" class="div-input">
                        <label class="label">max-width:</label>
                        <input type="text" v-model="element.maxWidth" placeholder="# px | %"/>
                      </div>

                      <!-- Sort option - chỉ hiển thị khi không phải SELECT -->
                      <template v-if="element.type !== ColumnType.SELECT">
                        <div style="margin-top: 4px" class="div-input">
                          <label class="label">Sort by field:</label>
                          <select v-model="element.sortField">
                            <option value="">No sort</option>
                            <option v-for="field in sortableFields" 
                              :key="field.vfAcutalField" 
                              :value="field.vfAcutalField"
                            >
                              {{ field.vfActualFieldTitle }}
                            </option>
                          </select>
                        </div>
                      </template>
                    </div>
                  </template>
                </Popper>
                
                <input :disabled="disabled" class="input-title" type="text" v-model="element.title" placeholder="Column name"/>
              </div>
              <ul v-if="element.type !== ColumnType.SELECT" class="list-selected-field">
                <li v-for="vfCode in element.fieldCodes" :key="vfCode">
                  <img v-if="mapFieldInfo[vfCode]?.vfType === VfType.ICON" class="icon-selected":src="mapFieldInfo[vfCode]?.value" />
                  <span v-else>{{ mapFieldInfo[vfCode]?.vfTitle }}</span>
                </li>
                <li v-show="!element.fieldCodes.length" class="no-data">Kéo field vào đây</li>
              </ul>
            </div>
            <div>
              <button class="btn btn-close" @click.stop="closeIndex(index)" :disabled="disabled">
                ✘
              </button>
            </div>
          </li>
        </draggable>
      </div>

      <div class="edit-columns">
        <div class="justify-content-space-between">
          <h5>Fields</h5>
          <div class="search-field">
            <input 
              type="text" 
              v-model="searchFieldText" 
              placeholder="Tìm kiếm..." 
              class="search-input"
            />
            <button 
              v-if="searchFieldText"
              class="btn-clear" 
              @click="searchFieldText = ''"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          </div>
        </div>
        <hr style="margin: 5px 0"/>
        <ul class="list-field custom-scroll">
          <li v-for="field in filteredFields" :key="field.field">
            <div class="label">{{ field.title }}:</div>
            <div class="item" :class="{disabled: disabled}" draggable="true" @dragstart="e => onDragstart(e, vfield)" v-for="vfield in field.variants" :key="vfield.vfCode" @dblclick="onAddingField(vfield)"> {{ vfield.vfTitle }} </div>
          </li>
        </ul>
      </div>

      <div class="edit-columns etc-field custom-scroll">
        <div>
          <div class="justify-content-space-between section-header" @click="toggleSection('labels')">
            <h5> Labels </h5>
            <div class="section-actions">
              <button class="btn-plus" :disabled="disabled" @click.stop="onAddLabel">✚</button>
              <span class="collapse-icon" :class="{ 'collapsed': !isSectionOpen.labels }">▼</span>
            </div>
          </div>
          <hr style="margin: 5px 0"/>
          <div class="section-content" v-show="isSectionOpen.labels">
            <ul class="list-field-symbol">
              <li v-for="field in labelsTransform" :key="field.vfCode">
                <div @click="!disabled && onEditLabel(field)" :style="getStyleLabel(field)" @dblclick="onAddingField(field)" class="item btn" :class="{disabled: disabled}" draggable="true" @dragstart="e => onDragstart(e, field)"> {{ field.vfTitle }} </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="margin-top: 10px">
          <div class="justify-content-space-between section-header" @click="toggleSection('actions')">
            <h5>Actions</h5>
            <span class="collapse-icon" :class="{ 'collapsed': !isSectionOpen.actions }">▼</span>
          </div>
          <hr style="margin: 5px 0"/>
          <div class="section-content" v-show="isSectionOpen.actions">
            <ul class="list-field-symbol">
              <li v-for="field in actions" :key="field.vfAcutalField">
                <div @dblclick="onAddingField(field)" class="item btn" :class="{disabled: disabled}" draggable="true" @dragstart="e => onDragstart(e, field)"> {{ field.vfTitle }} </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="margin-top: 10px">
          <div class="justify-content-space-between section-header" @click="toggleSection('separator')">
            <h5>Separator</h5>
            <span class="collapse-icon" :class="{ 'collapsed': !isSectionOpen.separator }">▼</span>
          </div>
          <hr style="margin: 5px 0"/>
          <div class="section-content" v-show="isSectionOpen.separator">
            <ul class="list-field-symbol">
              <li v-for="field in symbols" :key="field.vfAcutalField">
                <div @dblclick="onAddingField(field)" class="item" :class="{disabled: disabled}" draggable="true" @dragstart="e => onDragstart(e, field)"> {{ field.vfTitle }} </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="margin-top: 10px">
          <div class="justify-content-space-between section-header" @click="toggleSection('icons')">
            <h5>Icons</h5>
            <span class="collapse-icon" :class="{ 'collapsed': !isSectionOpen.icons }">▼</span>
          </div>
          <hr style="margin: 5px 0"/>
          <div class="section-content" v-show="isSectionOpen.icons">
            <ul class="list-field-symbol">
              <li v-for="field in icons" :key="field.vfAcutalField">
                <img @dblclick="onAddingField(field)" :src="field.value" class="icon" :class="{disabled: disabled}" draggable="true" @dragstart="e => onDragstart(e, field)"/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <PopupEditLabel
      ref="popupEditLabelRef"
      :presets="labelPresets"
      @save="handleSaveLabel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueDraggableNext as draggable } from "vue-draggable-next";
import Popper from "vue3-popper";
import { toJson } from '@/utils/parse';
import { VfField, VariantsField, Column, VfType, LabelField, LabelPreset, ColumnType, SortConfig } from '@/interfaces/table';
import type { CSSProperties } from 'vue';
import { symbols } from '@/constants/symbols';
import AlignLeftIcon from '@/assets/icons/align-left.svg';
import AlignCenterIcon from '@/assets/icons/align-center.svg';
import AlignRightIcon from '@/assets/icons/align-right.svg';
import VerticalAlignTopIcon from '@/assets/icons/vertal-align-top.svg';
import VerticalAlignCenterIcon from '@/assets/icons/vertal-align-center.svg';
import VerticalAlignBottomIcon from '@/assets/icons/vertal-align-bottom.svg';
import '@/assets/style.scss';
import PopupEditLabel from './PopupEditLabel.vue';

interface Props {
  modelValue: Column[];
  labels?: LabelField[];
  vfFields: VfField[];
  actions: VfField[];
  icons: VfField[];
  height?: number;
  disabled?: boolean;
  labelPresets?: LabelPreset[];
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  height: 390,
  labelPresets: () => [],
  labels: () => [],
  actions: () => [],
  icons: () => [],
  vfFields: () => [],
});

const emit = defineEmits<{
  (e: "update:modelValue", columnEdit: Column[]): void;
  (e: "update:labels", labels: LabelField[]): void;
  (e: "error", s: string): void;
}>();

const columnsEdit = computed({
  get() {
    return props.modelValue;
  },
  set(values: Column[]) {
    emit("update:modelValue", values);
  }
})

const labelsEdit = computed({
  get() {
    return props.labels || [];
  },
  set(values: LabelField[]) {
    emit("update:labels", values);
  }
});

const labelsTransform = computed<VfField[]>(() => {
  return labelsEdit.value.map(label => ({
    vfCode: label.code,
    vfTitle: label.title,
    vfType: VfType.LABEL,
    vfAcutalField: label.code,
    vfActualFieldTitle: label.title,
  }));
});

const columnsTemplate = computed(() => {
  return [...symbols, ...props.actions, ...props.icons, ...props.vfFields, ...labelsTransform.value];
});

const mapFieldInfo = computed(() => {
  return columnsTemplate.value.reduce((map: {[vfCode: string]: VfField}, field: VfField) => {
    map[field.vfCode] = field;
    return map;
  }, {});
});

const activeIndex = ref(-1);

const listFields = computed<VariantsField[]>(() => {
  const mapField: {[field: string]: number} = {};
  const list: VariantsField[] = [];

  for(const vfField of props.vfFields) {
    const vfAcutalField = vfField?.vfAcutalField || '';
    if (mapField[vfAcutalField] === undefined) {
      list.push({
        title: vfField.vfActualFieldTitle || '',
        field: vfAcutalField,
        variants: [vfField],
      });

      mapField[vfAcutalField] = list.length - 1;
    } else {
      list[mapField[vfAcutalField]].variants.push(vfField);
    }
  }

  return list;
});

const searchFieldText = ref('')

const filteredFields = computed<VariantsField[]>(() => {
  if (!searchFieldText.value) return listFields.value
  
  const searchLower = searchFieldText.value.toLowerCase()
  
  return listFields.value.filter(field => {
    // Kiểm tra title của field
    if (field.title.toLowerCase().includes(searchLower)) return true
    
    // Kiểm tra các variants
    return field.variants.some(variant => {
      return (
        variant.vfCode.toLowerCase().includes(searchLower) ||
        variant.vfTitle.toLowerCase().includes(searchLower) ||
        (variant.vfAcutalField && variant.vfAcutalField.toLowerCase().includes(searchLower)) ||
        (variant.vfActualFieldTitle && variant.vfActualFieldTitle.toLowerCase().includes(searchLower))
      )
    })
  })
})

const onAddColumn = () => {
  emit('update:modelValue', [
    ...props.modelValue,
    {
      title: '',
      fieldCodes: [],
      isDrag: false,
      type: ColumnType.DATA,
    }
  ]);
};

const onDragstart = (e: any, field: VfField) => {
  e.dataTransfer.setData("text", JSON.stringify(field));
}

const onDragover = (e: any, column: Column) => {
  if (props.disabled || column.type === ColumnType.SELECT) {
    return false;
  }
  e.preventDefault();
  column.isDrag = true;
}

const onDragleave = (e: any, column: Column) => {
  if (props.disabled) {
    return false;
  }
  e.preventDefault();
  column.isDrag = false;
}

const onDrop = (e: any, column: Column, index: number) => {
  if (props.disabled || column.type === ColumnType.SELECT) {
    return false;
  }
  e.preventDefault();
  const data = toJson(e.dataTransfer.getData("text"));
  if (data && data.vfCode) {
    column.fieldCodes.push(data.vfCode);
  }
  column.isDrag = false;

  activeIndex.value = index;
}

const closeIndex = (index: number) => {
  const values = props.modelValue;
  const column = values[index];
  if (column.fieldCodes.length > 0) {
    // column.fieldCodes.length = 0;
    column.fieldCodes.pop();
  } else {
    values.splice(index, 1);
    activeIndex.value = -1;
  }
  emit('update:modelValue', values);
}

const onAddingField = (field: VfField) => {
  if (props.disabled) return;
  if (activeIndex.value >= 0) {
    const column = columnsEdit.value[activeIndex.value];
    column && column.fieldCodes.push(field.vfCode);
  } else {
    emit('error', 'Hãy chọn column để thêm');
  }
}

// label
const popupEditLabelRef = ref<InstanceType<typeof PopupEditLabel>>()

const getStyleLabel = computed(() => (field: VfField): CSSProperties => {
  const label = labelsEdit.value.find(label => label.code === field.vfCode)
  return label?.style || {}
})

const onAddLabel = () => {
  popupEditLabelRef.value?.show()
}

const onEditLabel = (field: VfField) => {
  const label = labelsEdit.value.find(label => label.code === field.vfCode)
  if (label) {
    popupEditLabelRef.value?.show(label)
  }
}

const handleSaveLabel = (data: LabelField) => {
  console.log('handleSaveLabel', data)
  const label = labelsEdit.value.find(label => label.code === data.code)
  if (label) {
    label.title = data.title
    label.style = data.style
  } else {
    labelsEdit.value.push(data)
  }
  emit('update:labels', labelsEdit.value)
}

const isSectionOpen = ref({
  labels: true,
  actions: true,
  separator: true,
  icons: true
})

const toggleSection = (section: keyof typeof isSectionOpen.value) => {
  isSectionOpen.value[section] = !isSectionOpen.value[section]
}

const sortableFields = computed(() => {
  const fieldMap = new Map<string, VfField>();
  props.vfFields.forEach((field: VfField) => {
    if (field.vfAcutalField && !fieldMap.has(field.vfAcutalField)) {
      fieldMap.set(field.vfAcutalField, field);
    }
  });
  return Array.from(fieldMap.values());
});

const handleColumnTypeChange = (column: Column) => {
  if (column.type === ColumnType.SELECT) {
    // Chỉ reset các thuộc tính liên quan đến sort và field codes
    column.fieldCodes = [];
    column.sortField = undefined;
    // Không reset align và các thuộc tính khác
  }
};
</script>

<style lang="scss" scoped>
.box {
  &.box-grid {
    padding: 10px;
    // height: 390px;
  }
}

.dynamic-table {
  font-size: 12px;
}

.disabled {
  cursor: not-allowed !important;
}

.grid-col-2 {
  display: grid;
  grid-template-columns: 3fr 2fr 1fr;
  height: calc(100% - 10px);
  // height: 100%;

  .edit-columns {
    border: 1px solid #DDD;
    border-radius: 5px;
    padding: 5px;
    width: calc(100% - 15px);
    min-height: calc(100% - 15px);
    height: 100%;

    &.etc-field {
      overflow: auto;
    }
    
    h5 {
      margin: 0;
    }

    .btn-plus {
      width: 30px;
      padding: 1px 0;
      cursor: pointer;
      color: rgb(35, 32, 211);
      border: 1px solid;
      border-radius: 5px;

      &:disabled {
        color: #999;
        cursor: not-allowed;
      }
    }

    ul.list-field {
      padding-left: 0;
      list-style: none;
      margin: 0;
      max-height: calc(100% - 33px);
      overflow: auto;

      li {
        border-radius: 5px;
        white-space: nowrap;
        padding: 2px 4px;
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 12px;

        &:first-child {
          margin-left: 4px;
        }

        &.no-data {
          color: #999;
        }

        .label {

        }
        .item {
          border-radius: 5px;
          border: 1px solid #DDD;
          padding: 2px 4px;
          margin-left: 4px;
          min-width: 20px;
          text-align: center;
          cursor: grab;
        }
      }

      li + li {
        margin-left: 4px;
      }
    }

    ul.list-field-symbol {
      padding-left: 0;
      list-style: none;
      margin: 0;
      display: block;
      min-width: 20px;
      li {
        display: inline-block;
        margin-bottom: 4px;

        .item, .icon {
          border-radius: 5px;
          border: 1px solid #DDD;
          padding: 2px 4px;
          margin-left: 4px;
          min-width: 20px;
          text-align: center;
          cursor: grab;
        }

        .icon {
          height: 18px;
        }
      }
    }
  }

  .edit-columns + .edit-columns {
    margin-left: 5px;
  }
}

ul.list-group {
  padding-left: 0;
  height: calc(100% - 33px);
  overflow-y: auto;
  margin: 0;
  list-style: none;
  li.list-group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    margin-top: 4px;
    border: 1px solid #DDD;
    border-radius: 5px;

    &.hover {
      border-color: #F00;
    }

    &.sortable-chosen {
      border-color: #F00;
      cursor: move;
    }
    &.active {
      border-color: #94d53b;
    }

    .label {
      width: 100%;
      .input-title {
        border: none;
        border-bottom: 1px #ddd dotted;
        outline: none;
        width: 120px;
        margin-left: 4px;
      }

      .handle {
        cursor: move;
      }

      .btn-more {
        background: none;
        border-radius: 5px;
        border: 1px solid #DDD;
        cursor: pointer;
        margin: 0 2px;

        &:hover, &.active {
          color: #2320d3;
          border-color: #2320d3;
        }

        img {
          width: 20px;
          width: 20px
        }
      }

      ul.list-selected-field {
        padding-left: 0;
        list-style: none;
        margin: 0;
        li {
          border: 1px solid #DDD;
          border-radius: 5px;
          white-space: nowrap;
          padding: 2px 4px;
          display: inline-block;
          margin-bottom: 4px;
          font-size: 12px;
          min-width: 20px;
          text-align: center;

          &:first-child {
            margin-left: 4px;
          }

          &:has(.icon-selected) {
            padding: 2px;
          }

          .icon-selected {
            height: 12px;
            margin-bottom: -2px;
          }

          &.no-data {
            border: none;
            color: #999;
          }
        }
        li + li {
          margin-left: 4px;
        }
      }
    }

    .btn {
      width: 30px;
      cursor: pointer;
      border: 1px solid;
      border-radius: 5px;

      &.btn-edit {
        color: #9290f0;
      }

      &.btn-close {
        color: #F00;
        &:disabled {
          color: #999;
          cursor: not-allowed;
        }
      }
    }

    .btn + .btn {
      margin-left: 4px;
    }
  }
}

.popper-wrapper {
  border: none !important;
  margin: 0 1px !important;
}

.popover-action {
  width: max-content;
  .div-input {
    display: flex;
    .label {
      width: 90px !important;
      margin-right: 10px;
    }
    input[type="text"], select {
      width: 120px;
      outline: none;
      border: 1px solid #AAA;
      border-radius: 3px;
      padding: 2px;
    }
    select {
      width: 126px !important;
    }
  }
}

.search-field {
  display: flex;
  align-items: center;
  position: relative;
  
  .search-input {
    padding: 2px 8px;
    padding-right: 28px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    width: 150px;
    outline: none;
    color: #666;
  }

  .btn-clear {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 2px 4px;
    cursor: pointer;
    color: #999;
    font-size: 12px;
    line-height: 1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14x;
    height: 14px;

    &:hover {
      background-color: #f5f5f5;
      color: #666;
    }
  }
}

.section-header {
  cursor: pointer;
  user-select: none;
  
  &:hover {
    .collapse-icon {
      color: #2320d3;
    }
  }
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.collapse-icon {
  font-size: 10px;
  color: #999;
  transition: transform 0.2s;
  
  &.collapsed {
    transform: rotate(-90deg);
  }
}

.section-content {
  transition: all 0.2s;
}
</style>