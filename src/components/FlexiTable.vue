<template>
  <div class="flexi-table">
    <!-- Header controls -->
    <div class="table-controls">
      <div class="layout-selector">
        <h4>Layout: </h4>
        <div class="dropdown">
          <select v-model="selectedLayoutId">
            <option v-for="layout in layouts" 
              :key="layout.id" 
              :value="layout.id"
            >
              {{ layout.title }}
            </option>
          </select>
        </div>
        
        <!-- Quick select buttons -->
        <div class="quick-layouts">
          <button v-for="layout in layouts" 
            :key="layout.id"
            @click="selectedLayoutId = layout.id"
            :class="{active: selectedLayoutId === layout.id}"
          >
            {{ layout.title }}
          </button>
        </div>
      </div>

      <!-- Settings button -->
      <div class="settings">
        <button @click="showEdit">
          ⚙️
        </button>
      </div>
    </div>

    <!-- Table content -->
    <DynamicTable
      :columns="selectedLayout?.columns || []"
      :templates="[...templates, ...actions, ...icons]"
      :data="data"
      :height="height"
      :fixed="fixed"
      @onCta="handleTableAction"
    />

    <!-- Editor popup -->
    <div v-if="isShowEdit" class="editor-popup">
      <div class="editor-overlay" @click="isShowEdit = false"></div>
      <div class="editor-content">
        <div class="editor-header">
          <h3>Tùy chỉnh bảng</h3>
          <button @click="isShowEdit = false">✕</button>
        </div>
        
        <div class="editor-body">
          <DynamicTable
            :columns="ColumnsEdit"
            :templates="[...templates, ...actions, ...icons]"
            :data="data"
            :height="300"
            :fixed="true"
          />
          <!--actions-->
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
            <button :disabled="selectedLayoutEdit?.isSystem" @click="onSaveHandle">
              Lưu
            </button>
            <button :disabled="!selectedLayoutEdit?.isSave || selectedLayoutEdit?.id === selectedLayoutId" @click="onSetDefaultHandle">
              Default
            </button>
          </div>

          <TableEditor
            v-model="ColumnsEdit"
            :vf-fields="templates"
            :actions="actions"
            :icons="icons"
            :height="300"
            :disabled="selectedLayoutEdit?.isSystem"
            @error="handleEditorError"
          />
        </div>

        <!-- <div class="editor-footer">
          <input v-model="layoutName" placeholder="Tên layout mới"/>
          <button @click="saveLayout">Lưu layout</button>
          <button @click="applyChanges">Áp dụng</button>
          <button @click="showEditor = false">Hủy</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import DynamicTable from './DynamicTable.vue';
import TableEditor from './TableEditor.vue';
import { Column, VfField, LayoutTemplate } from '@/interfaces/table';
import { v4 as uuidv4 } from 'uuid';
import { title } from 'process';

interface LayoutTemplateEdit extends LayoutTemplate {
  isSave: boolean;
}

interface Props {
  modelValue: string;
  layouts: LayoutTemplate[];
  templates: VfField[];
  actions: VfField[];
  icons: VfField[];
  data: any[];
  height?: number;
  fixed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layouts: () => [],
  templates: () => [],
  actions: () => [],
  icons: () => [],
  data: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void;
  (e: 'onCta', action: string, row: any, index: number): void;
  (e: 'error', msg: string): void;
  (e: 'save', layout: LayoutTemplate, callback: () => void): void;
  (e: 'remove', id: string, callback: () => void): void;
  (e: 'setDefault', id: string, callback: () => void): void;
}>();

// State
const isShowEdit = ref(false);
const selectedLayoutId = computed({
  get(): string {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  }
});

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
const layoutsEdit = ref<LayoutTemplateEdit[]>([]);
const editingId = ref('');
const selectedLayoutEdit = computed(() => {
  return layoutsEdit.value.find(layout => layout.id === editingId.value)
});
const ColumnsEdit = computed(() => {
  return selectedLayoutEdit.value?.columns || []
})

const showEdit = () => {
  isShowEdit.value = true;
  editingId.value = selectedLayoutId.value;
  layoutsEdit.value = JSON.parse(JSON.stringify(props.layouts || [])).map((layout: LayoutTemplate) => {
    return {
      ...layout,
      isSave: true,
    }
  });
}

const onChangeLayoutEdit = () => {
  // ColumnsEdit.value = layoutsEdit.value.find(layout => layout.id === editingId.value)?.columns || [];
};

const onCloneHandle = () => {
  const newId = uuidv4();
  const newLayout = {
    ...JSON.parse(JSON.stringify(selectedLayoutEdit.value)),
    isSave: false,
    isSystem: false,
    isDefault: false,
    id: newId,
    title: `${selectedLayoutEdit.value?.title || ''} clone`
  }
  layoutsEdit.value.push(newLayout);
  editingId.value = newId;
};

const onDeleteHandle = () => {
  const deleteId = editingId.value;

  const removeLayout = () => {
    const index = layoutsEdit.value.findIndex(layout => layout.id === deleteId);
    layoutsEdit.value.splice(index, 1);

    editingId.value = layoutsEdit.value[0].id || '';
  }

  if (selectedLayoutEdit.value?.isSave) {
    emit('remove', deleteId, () => {
      removeLayout();
    })
  } else {
    removeLayout();
  }
};

const onSaveHandle = () => {
  const saveLayout = JSON.parse(JSON.stringify(selectedLayoutEdit.value));
  delete saveLayout.isSave;
  emit('save', saveLayout, () => {
    selectedLayoutEdit.value && (selectedLayoutEdit.value.isSave = true);
  });
};

const onSetDefaultHandle = () => {
  emit('setDefault', editingId.value, () => {});
};
// end edit

onMounted(() => {
  //
});
</script>

<style lang="scss" scoped>
.flexi-table {
  h4 {
    margin: 0
  }
  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin-bottom: 1rem;
    
    .layout-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;

      .dropdown select {
        padding: 2px 4px;
        width: 250px;
        border-radius: 4px;
        outline: none;
      }

      .quick-layouts {
        display: flex;
        gap: 0.5rem;
        
        button {
          padding: 2px 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;

          &.active {
            background: #d4f9d4;
            border-color: green;
            color: red;
          }
        }
      }
    }
  }

  .editor-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    .editor-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
    }

    .editor-content {
      position: relative;
      background: white;
      border-radius: 8px;
      padding: 0.5rem;
      overflow-y: auto;
      min-width: 800px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
        }
      }

      .editor-body {

      }

      .editor-actions {
        display: flex;
        align-items: center;
        margin: 10px 0;
        gap: 0.5rem;

        .dropdown select {
          padding: 2px 4px;
          width: 250px;
          border-radius: 4px;
          outline: none;
        }
      }

      // .editor-footer {
      //   margin-top: 1rem;
      //   display: flex;
      //   gap: 1rem;
      //   justify-content: flex-end;

      //   input {
      //     padding: 0.5rem;
      //     border: 1px solid #ddd;
      //     border-radius: 4px;
      //   }

      //   button {
      //     padding: 0.5rem 1rem;
      //     border-radius: 4px;
      //     cursor: pointer;

      //     &:last-child {
      //       background: white;
      //       border: 1px solid #ddd;
      //     }
      //   }
      // }
    }
  }
}
</style>
