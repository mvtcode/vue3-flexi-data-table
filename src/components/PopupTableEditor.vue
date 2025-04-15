<template>
  <el-dialog v-model="isShow" :title="title" width="80%">
    <DynamicTable
      :columns="selectedLayout?.columns || []"
      :labels="selectedLayout?.labels || []"
      :templates="[...vfFields, ...actions, ...icons]"
      :data="data"
      :height="tableHeight"
      :fixed="true"
      :close-on-click-modal="false"
      @onCta="handleTableAction"
      @selectChange="handleSelectChange"
      @sortChange="handleSortChange"
    />

    <div style="width: 100%; margin: 0.5rem 0;" />

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
        <el-button size="small" type="primary" plain @click="onCloneHandle">
          Clone
        </el-button>
        <el-button size="small" type="danger" plain :disabled="selectedLayout?.isSystem" @click="onDeleteHandle">
          Xóa
        </el-button>
        <el-button size="small" type="success" plain :disabled="selectedLayout?.isSystem" @click="showSaveDialog">
          Lưu
        </el-button>
        <el-button size="small" type="info" plain :disabled="!selectedLayout?.isSave || selectedLayout?.id === defaultLayoutId" @click="onSetDefaultHandle">
          Default
        </el-button>
      </el-space>
    </el-space>

    <!-- <div>
      <el-select v-model="selectedLayoutId" placeholder="Select Layout" size="small" style="width: 180px;">
        <el-option v-for="layout in layouts" :key="layout.id" :value="layout.id" :label="layout.title" />
      </el-select>
    </div> -->


  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { LayoutTemplate, VfField, LabelPreset } from '@/interfaces/table';
import DynamicTable from './DynamicTable.vue';

interface LayoutTemplateEdit extends LayoutTemplate {
  isSave: boolean;
}

interface Props {
  title: string;
  tableHeight: number;
  editorHeight: number;
  vfFields: VfField[];
  actions: VfField[];
  icons: VfField[];
  labelPresets?: LabelPreset[];
  data: any[];
  defaultLayoutId: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Edit table layout',
  tableHeight: 250,
  editorHeight: 250,
  vfFields: () => [],
  actions: () => [],
  icons: () => [],
  labelPresets: () => [],
  data: () => [],
  defaultLayoutId: '',
});

const emit = defineEmits<{
  (e: 'error', s: string): void;
  (e: 'save', layout: LayoutTemplate, callback: () => void): void;
  (e: 'remove', id: string, callback: () => void): void;
  (e: 'setDefault', id: string, callback: () => void): void;
  (e: 'selectChange', selectedRows: number[]): void;
}>();

const layouts = ref<LayoutTemplateEdit[]>([]);
const selectedLayoutId = ref('');
const selectedLayout = computed(() => {
  return layouts.value.find((layout: LayoutTemplateEdit) => layout.id === selectedLayoutId.value);
});

const isShow = ref(false);

const onCloneHandle = () => {
  const newId = uuidv4();
  const newLayout = {
    ...JSON.parse(JSON.stringify(selectedLayout.value)),
    isSave: false,
    isSystem: false,
    isDefault: false,
    id: newId,
    title: `${selectedLayout.value?.title || ''} clone`
  }
  layouts.value.push(newLayout as LayoutTemplateEdit);
  selectedLayoutId.value = newId;
};

const onDeleteHandle = () => {
  const deleteId = selectedLayoutId.value;

  const removeLayout = () => {
    const index = layouts.value.findIndex((layout: LayoutTemplateEdit) => layout.id === deleteId);
    layouts.value.splice(index, 1);
    selectedLayoutId.value = layouts.value[0].id || '';
  }

  if (selectedLayout.value?.isSave) {
    emit('remove', deleteId, () => {
      removeLayout();
    })
  } else {
    removeLayout();
  }
};

const showSaveDialog = () => {
  // isShowSaveDialog.value = true;
  // newLayoutTitle.value = selectedLayoutEdit.value?.title || '';
};

const onSetDefaultHandle = () => {
  emit('setDefault', selectedLayoutId.value, () => {
    // selectedLayoutId.value = layouts.value[0].id || '';
  });
};

const show = (_selectedLayoutId: string, _layouts: LayoutTemplate[]) => {
  isShow.value = true;
  selectedLayoutId.value = _selectedLayoutId;
  layouts.value = JSON.parse(JSON.stringify(_layouts)).map((layout: LayoutTemplate) => {
    return {
      ...layout,
      isSave: true,
    }
  });
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
</style>