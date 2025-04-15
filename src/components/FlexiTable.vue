<template>
  <div class="flexi-table">
    <!-- Header controls -->
     <!-- <el-space direction="vertical" size="small" fill> -->
      <div class="table-controls">
        <el-space size="small">
          <el-text>Layout:</el-text>
          <el-select v-model="selectedLayoutId" placeholder="Select Layout" size="small" style="width: 180px;">
            <el-option v-for="layout in layouts" 
              :key="layout.id"
              :value="layout.id"
              :label="layout.title"
            />
          </el-select>
          
          <!-- Quick select buttons -->
          <el-space size="small">
            <el-button v-for="layout in layouts" 
              :key="layout.id"
              @click="selectedLayoutId = layout.id"
              size="small"
              type="primary"
              :plain="selectedLayoutId !== layout.id"
            >
              {{ layout.title }}
            </el-button>
          </el-space>
        </el-space>

        <!-- Settings button -->
        <el-space size="small">
          <slot name="actions"/>
          <el-button @click="showEdit" :icon="Setting" size="small" type="primary" plain />
        </el-space>
      </div>

      <div style="width: 100%; margin: 0.5rem 0;"/>

      <!-- Table content -->
      <DynamicTable
        ref="dynamicTableRef"
        :columns="selectedLayout?.columns || []"
        :labels="selectedLayout?.labels || []"
        :templates="[...templates, ...actions, ...icons]"
        :data="data"
        :height="height"
        :fixed="fixed"
        @onCta="handleTableAction"
        @selectChange="handleSelectChange"
        @sortChange="handleSortChange"
      />
    <!-- </el-space> -->

    <!-- Editor popup -->
    <!-- <div v-if="isShowEdit" class="editor-popup">
      <div class="editor-overlay" @click="isShowEdit = false"></div>
      <div class="editor-content">
        <div class="editor-header">
          <h3>Tùy chỉnh bảng</h3>
          <button @click="isShowEdit = false">✕</button>
        </div>
        
        <div class="editor-body">
          <DynamicTable
            :columns="ColumnsEdit"
            :labels="selectedLayoutEdit?.labels || []"
            :templates="[...templates, ...actions, ...icons]"
            :data="data"
            :height="250"
            :fixed="true"
          />
          <div class="editor-actions">
            <h4>Layout:</h4>
            <div class="dropdown">
              <select v-model="editingId" @change="onChangeLayoutEdit">
                <option v-for="layout in layoutsEdit"
                  :key="layout.id" 
                  :value="layout.id"
                >
                  {{ layout.title }}
                </option>
              </select>
            </div>
            <button @click="onCloneHandle">
              Clone
            </button>
            <button :disabled="selectedLayoutEdit?.isSystem" @click="onDeleteHandle">
              Xóa
            </button>
            <button :disabled="selectedLayoutEdit?.isSystem" @click="showSaveDialog">
              Lưu
            </button>
            <button :disabled="!selectedLayoutEdit?.isSave || selectedLayoutEdit?.id === selectedLayoutId" @click="onSetDefaultHandle">
              Default
            </button>
          </div>

          <TableEditor
            v-model="ColumnsEdit"
            v-model:labels="selectedLayoutEdit!.labels"
            :vf-fields="templates"
            :actions="actions"
            :icons="icons"
            :height="450"
            :disabled="selectedLayoutEdit?.isSystem"
            :label-presets="labelPresets"
            @error="handleEditorError"
          />
        </div>
      </div>
    </div>

    <div v-if="isShowSaveDialog" class="save-dialog">
      <div class="dialog-overlay" @click="isShowSaveDialog = false"></div>
      <div class="dialog-content">
        <h3>Lưu Layout</h3>
        <div class="form-group">
          <label>Tên Layout:</label>
          <input 
            v-model="newLayoutTitle" 
            type="text" 
            placeholder="Nhập tên layout"
            @keyup.enter="onSaveHandle"
          >
        </div>
        <div class="dialog-actions">
          <button @click="isShowSaveDialog = false">Hủy</button>
          <button @click="onSaveHandle" :disabled="!newLayoutTitle">Lưu</button>
        </div>
      </div>
    </div> -->

    <PopupTableEditor
      ref="popupTableEditorRef"
      title="[Nâng cao] Cấu hình cách hiển thị bảng dữ liệu"
      :tableHeight="280"
      :editorHeight="450"
      :vfFields="templates"
      :actions="actions"
      :icons="icons"
      :labelPresets="labelPresets"
      :data="data"
      :defaultLayoutId="defaultLayoutId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DynamicTable from './DynamicTable.vue';
import TableEditor from './TableEditor.vue';
import { Column, VfField, LayoutTemplate, LabelPreset } from '@/interfaces/table';
import { v4 as uuidv4 } from 'uuid';
import { Setting } from '@element-plus/icons-vue';
import PopupTableEditor from './PopupTableEditor.vue';

// interface LayoutTemplateEdit extends LayoutTemplate {
//   isSave: boolean;
// }

interface Props {
  // modelValue: string;
  layouts: LayoutTemplate[];
  templates: VfField[];
  actions: VfField[];
  icons: VfField[];
  data: any[];
  height?: number;
  fixed?: boolean;
  labelPresets?: LabelPreset[];
}

const props = withDefaults(defineProps<Props>(), {
  layouts: () => [],
  templates: () => [],
  actions: () => [],
  icons: () => [],
  data: () => [],
  labelPresets: () => [],
});

const emit = defineEmits<{
  // (e: 'update:modelValue', id: string): void;
  (e: 'onCta', action: string, row: any, index: number): void;
  (e: 'error', msg: string): void;
  (e: 'save', layout: LayoutTemplate, callback: () => void): void;
  (e: 'remove', id: string, callback: () => void): void;
  (e: 'setDefault', id: string, callback: () => void): void;
  (e: 'selectChange', selectedRows: number[]): void;
  (e: 'sortChange', sortConfig: { field?: string; direction?: 'asc' | 'desc' }): void;
}>();

// State
// const isShowEdit = ref(false);
const popupTableEditorRef = ref<InstanceType<typeof PopupTableEditor>>();
// const selectedLayoutId = computed({
//   get(): string {
//     return props.modelValue
//   },
//   set(value: string) {
//     emit('update:modelValue', value)
//   }
// });

const selectedLayoutId = ref(props.layouts[0].id || '');
const defaultLayoutId = ref(props.layouts[0].id || '');

const selectedLayout = computed(() => {
  return props.layouts.find(layout => layout.id === selectedLayoutId.value)
});

const handleEditorError = (error: string) => {
  emit('error', error);
};

const handleTableAction = (action: string, row: any, index: number) => {
  emit('onCta', action, row, index);
};

// edit
// const layoutsEdit = ref<LayoutTemplateEdit[]>([]);
// const editingId = ref('');
// const selectedLayoutEdit = computed(() => {
//   return layoutsEdit.value.find(layout => layout.id === editingId.value)
// });
// const ColumnsEdit = computed({
//   get() {
//     return selectedLayoutEdit.value?.columns || []
//   },
//   set(value: Column[]) {
//     selectedLayoutEdit.value!.columns = value;
//   }
// })

const showEdit = () => {
  // isShowEdit.value = true;
  // editingId.value = selectedLayoutId.value;
  // layoutsEdit.value = JSON.parse(JSON.stringify(props.layouts || [])).map((layout: LayoutTemplate) => {
  //   return {
  //     ...layout,
  //     isSave: true,
  //   }
  // });
  popupTableEditorRef.value?.show(selectedLayoutId.value, props.layouts);
}

const onChangeLayoutEdit = () => {
  // ColumnsEdit.value = layoutsEdit.value.find(layout => layout.id === editingId.value)?.columns || [];
};

// const onCloneHandle = () => {
//   const newId = uuidv4();
//   const newLayout = {
//     ...JSON.parse(JSON.stringify(selectedLayoutEdit.value)),
//     isSave: false,
//     isSystem: false,
//     isDefault: false,
//     id: newId,
//     title: `${selectedLayoutEdit.value?.title || ''} clone`
//   }
//   layoutsEdit.value.push(newLayout as LayoutTemplateEdit);
//   editingId.value = newId;
// };

// const onDeleteHandle = () => {
//   const deleteId = editingId.value;

//   const removeLayout = () => {
//     const index = layoutsEdit.value.findIndex(layout => layout.id === deleteId);
//     layoutsEdit.value.splice(index, 1);

//     editingId.value = layoutsEdit.value[0].id || '';
//   }

//   if (selectedLayoutEdit.value?.isSave) {
//     emit('remove', deleteId, () => {
//       removeLayout();
//     })
//   } else {
//     removeLayout();
//   }
// };

// const isShowSaveDialog = ref(false);
// const newLayoutTitle = ref('');

// const showSaveDialog = () => {
//   isShowSaveDialog.value = true;
//   newLayoutTitle.value = selectedLayoutEdit.value?.title || '';
// };

// const onSaveHandle = () => {
//   if (!newLayoutTitle.value) return;
  
//   const saveLayout = JSON.parse(JSON.stringify(selectedLayoutEdit.value));
//   delete saveLayout.isSave;
//   saveLayout.title = newLayoutTitle.value;
  
//   emit('save', saveLayout as LayoutTemplate, () => {
//     // Cập nhật lại danh sách layouts
//     const index = layoutsEdit.value.findIndex(layout => layout.id === saveLayout.id);
//     if (index !== -1) {
//       layoutsEdit.value[index] = {
//         ...saveLayout,
//         isSave: true
//       };
//     }
//     isShowSaveDialog.value = false;
//   });
// };

// const onSetDefaultHandle = () => {
//   emit('setDefault', editingId.value, () => {});
// };
// end edit

const handleSelectChange = (selectedRows: number[]) => {
  emit('selectChange', selectedRows);
};

const handleSortChange = (sortConfig: { field?: string; direction?: undefined | 'asc' | 'desc' }) => {
  emit('sortChange', sortConfig);
};

const dynamicTableRef = ref<InstanceType<typeof DynamicTable>>();
const getSelect = () => {
  return dynamicTableRef.value?.getSelect();
}
const setSelect = (indexes: number[]) => {
  dynamicTableRef.value?.setSelect(indexes);
}
const clearSelect = () => {
  dynamicTableRef.value?.clearSelect();
}

const setDefaultLayoutId = (id: string) => {
  defaultLayoutId.value = id;
  selectedLayoutId.value = id;
}

defineExpose({
  getSelect,
  setSelect,
  clearSelect,
  setDefaultLayoutId
});
</script>

<style lang="scss" scoped>
.flexi-table {
  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

:deep(.flexi-table .el-button) {
  & + .el-button {
    margin-left: 0.5rem !important;
  }
}
</style>
