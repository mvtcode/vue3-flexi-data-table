<template>
  <el-row :gutter="0" style="padding-bottom: 5px">
    <el-col :span="23">
      <LayoutSelector
        v-model="selectLayout"
        :options="optionsLayout"
        :max-visible="maxActions"
        @change="handleLayoutChange"
      />
    </el-col>
    <el-col :span="1" style="display: flex; justify-content: flex-end">
      <el-button @click="handleOpen" type="primary" circle>
        <el-icon><Setting /></el-icon>
      </el-button>
    </el-col>
  </el-row>

  <Table
    :fixed="props?.fixed"
    :height="props?.height"
    :columns="columnsEdit"
    :templates="[...vfFields, ...icons, ...actions, ...textFields]"
    :data="props.dataTable"
    @onCta="onCta"
  />

  <el-dialog
    v-model="dialogVisible"
    :title="props.settingsTitle || 'Cài đặt hiển thị'"
    width="calc(100vw - 100px)"
    top="25px"
    style="max-width: 1440px; height: 720px; overflow: hidden"
    @close="handleCloseDialog"
  >
    <el-scrollbar height="700px">
      <Table
        fixed
        :height="200"
        :columns="columnsEdit"
        :templates="[...vfFields, ...icons, ...actions, ...textFields]"
        :data="props.dataTable"
        @onCta="onCta"
      />

      <div class="action-box">
        <p style="font-weight: bold; font-size: 14px; color: #606266">
          Giao diện:
        </p>
        <el-select
          size="small"
          v-model="selectedTemplate"
          placeholder="Chọn giao diện"
          class="action-select"
          style="width: 230px"
          @change="handleTemplateChange"
        >
          <el-option
            v-for="item in props.optionsLayout"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <div class="button-group">
          <!-- Default Save button -->
          <el-button
            size="small"
            type="success"
            :disabled="!hasChanges"
            @click="handleSave"
            class="action-button"
          >
            <el-icon><Check /></el-icon>
            <span>Lưu</span>
          </el-button>

          <!-- Additional action buttons -->
          <slot
            name="additional-actions"
            :selected="selectedTemplate"
            :can-delete="canDelete"
            :on-delete="handleDelete"
            :on-default="handleDefault"
          />
        </div>
      </div>

      <EditorTable
        v-model="columnsEdit"
        :vfFields="vfFields"
        :actions="actions"
        :icons="icons"
        :height="360"
        :textFields="props.textFields"
        @onText="onTextChange"
      />
    </el-scrollbar>
  </el-dialog>

  <!-- Error dialog -->
  <el-dialog v-model="showError" title="Lỗi" width="400px" :show-close="false">
    <span>{{ errorMessage }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="showError = false"> Đóng </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { VfField, VfType, Column, OptionLayout } from "@/interfaces/table";
import { Check, Delete, SetUp, Setting } from "@element-plus/icons-vue";
import { cloneDeep } from "lodash";
import EditorTable from "./EditorTable.vue";
import Table from "./Table.vue";
import LayoutSelector from "./LayoutSelector.vue";

interface Props {
  optionsLayout: OptionLayout[];
  defaultValue?: string | number;
  maxActions?: number;
  dataTable: any[];
  columns: Column[];
  actions: VfField[];
  icons: VfField[];
  vfFields: VfField[];
  textFields: VfField[];
  dialogVisible: boolean;
  settingsTitle?: string;
  height?: number;
  fixed?: boolean;
}

const emit = defineEmits<{
  (e: "handleSave", value: OptionLayout, columns: Column[]): void;
  (e: "handleDelete", value: OptionLayout): void;
  (e: "handleDefault", value: OptionLayout): void;
  (e: "changeLayout", value: OptionLayout): void;
  (e: "handleOpen", value: boolean): void;
  (e: "handleClose", value: boolean): void;
  (e: "handleTemplateChange", value: OptionLayout): void;
  (e: "onCta", action: string, row: any, index: number): void;
  (e: "onText", data: VfField[]): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  maxActions: 6,
  height: 390,
  fixed: false,
});

// Track changes
const initialColumns = ref<Column[]>([]);
const selectedTemplate = ref<any>(props.defaultValue || props.optionsLayout[0]);
const selectLayout = ref<any>(props.defaultValue || props.optionsLayout[0]);
const dialogVisible = ref(props.dialogVisible);
const showError = ref(false);
const errorMessage = ref("");
const isNewLayout = ref(false);
let lastSavedTemplate: OptionLayout | null = null;

// Deep clone columns for tracking changes
const columnsEdit = ref<Column[]>(
  props.columns.map((column) => ({
    ...column,
    isDrag: false,
  }))
);

// Initialize change tracking when dialog opens
const initializeChangeTracking = () => {
  initialColumns.value = cloneDeep(columnsEdit.value);
  lastSavedTemplate = cloneDeep(selectedTemplate.value);
  isNewLayout.value = false;
};

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (isNewLayout.value) return true;

  // Check if template has changed
  if (
    JSON.stringify(selectedTemplate.value) !== JSON.stringify(lastSavedTemplate)
  ) {
    return true;
  }

  // Check if columns configuration has changed
  return (
    JSON.stringify(columnsEdit.value) !== JSON.stringify(initialColumns.value)
  );
});

// Check if layout can be deleted
const canDelete = computed(() => {
  const currentTemplate = selectedTemplate.value;

  if (props.optionsLayout.length <= 1) {
    return false;
  }

  if (currentTemplate.isDefault) {
    return false;
  }

  return true;
});

const handleDelete = () => {
  if (!canDelete.value) {
    errorMessage.value = selectedTemplate.value.isDefault
      ? "Không thể xóa giao diện mặc định"
      : "Phải có ít nhất một giao diện";
    showError.value = true;
    return;
  }

  emit("handleDelete", selectedTemplate.value);
};

const handleSave = () => {
  if (!hasChanges.value) return;

  emit("handleSave", selectedTemplate.value, columnsEdit.value);
  initializeChangeTracking(); // Reset change tracking after save
};

const handleDefault = () => {
  emit("handleDefault", selectedTemplate.value);
};

const onTextChange = (data: VfField[]) => {
  emit("onText", data);
};

const displayedButtons = computed(() => {
  return props.optionsLayout.slice(0, props.maxActions);
});

const handleOpen = () => {
  dialogVisible.value = true;
  emit("handleOpen", true);
  initializeChangeTracking();
};

const handleCloseDialog = () => {
  closeDialog();
};

const closeDialog = () => {
  dialogVisible.value = false;
  emit("handleClose", false);
  if (hasChanges.value) {
    columnsEdit.value = cloneDeep(initialColumns.value);
    selectedTemplate.value = cloneDeep(lastSavedTemplate);
  }
};

const isActive = computed(() => {
  return (value: string | number) => {
    return selectLayout.value.value === value;
  };
});

const handleTemplateChange = (value: string | number) => {
  const selectedOption = props.optionsLayout.find(
    (item) => item.value === value
  );
  if (selectedOption) {
    // Check if this is a new template
    isNewLayout.value = !props.optionsLayout.some(
      (layout) => layout.value === selectedOption.value
    );
    selectedTemplate.value = selectedOption;
    emit("handleTemplateChange", selectedOption);
  }
};

const handleLayoutChange = (value: string | number) => {
  const selectedOption = props.optionsLayout.find(
    (item) => item.value === value
  );
  if (selectedOption) {
    selectLayout.value = selectedOption;
    selectedTemplate.value = selectedOption;
    emit("changeLayout", selectedOption);
  }
};

const onCta = (action: string, row: any, index: number) => {
  emit("onCta", action, row, index);
};
</script>

<style lang="scss" scoped>
.action-box {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  padding-left: 0;
  gap: 5px;
  flex-wrap: wrap;

  .button-group {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .el-icon {
    margin-right: 0px;
    font-size: 15px;
  }

  :deep(.el-button + .el-button) {
    margin-left: 5px;
  }

  span {
    font-size: 13px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
