<template>
  <el-row :gutter="0" style="padding-bottom: 5px">
    <el-col :span="23">
      <el-space>
        Layout:
        <el-select
          size="small"
          v-model="selectLayout"
          clearable
          placeholder="Choose layout"
          style="min-width: 150px; max-width: 250px"
          @change="handleLayoutChange"
        >
          <el-option
            v-for="item in props.optionsLayout"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <template v-for="button in displayedButtons" :key="button.value">
          <el-button
            size="small"
            plain
            :type="isActive(button.value) ? 'success' : 'primary'"
            @click="handleLayoutChange(button.value)"
          >
            {{ button.label }}
          </el-button>
        </template>
      </el-space>
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
    :title="props.settingsTitle || 'Settings'"
    width="calc(100vw - 100px)"
    top="25px"
    style="max-width: 1440px; height: 720px; overflow: hidden"
    @close="handleClose"
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
          Name template:
        </p>
        <el-select
          size="small"
          v-model="selectedTemplate"
          placeholder="Chonse layout"
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
          <el-button
            size="small"
            type="primary"
            @click="handleClone"
            class="action-button"
            :disabled="isDisabled('isClone')"
          >
            <el-icon><Plus /></el-icon>
            <span><slot name="clone-text">Clone</slot></span>
          </el-button>
          <el-button
            size="small"
            type="success"
            @click="handleSave"
            class="action-button"
            :disabled="isDisabled('isEdit')"
          >
            <el-icon><Check /></el-icon>
            <span><slot name="save-text">Save</slot></span>
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete"
            class="action-button"
            :disabled="isDisabled('isDelete')"
          >
            <el-icon><Delete /></el-icon>
            <span><slot name="delete-text">Delete</slot></span>
          </el-button>
          <el-button
            size="small"
            @click="handleDefault"
            class="action-button"
            type="primary"
            plain
            :disabled="isDisabled('isDefault')"
          >
            <el-icon><SetUp /></el-icon>
            <span><slot name="default-text">Default</slot></span>
          </el-button>
          <el-button
            size="small"
            :disabled="isDisabled('isCopy')"
            @click="handleCopy"
            class="action-button"
          >
            <el-icon><CopyDocument /></el-icon>
            <span><slot name="copy-text">Copy</slot></span>
          </el-button>
        </div>
      </div>
      <EditorTable
        v-model="columnsEdit"
        :vfFields="vfFields"
        :actions="actions"
        :icons="icons"
        :height="360"
        :textFields="props.textFields"
        @onText="onText"
      />
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { VfField, VfType, Column, OptionLayout } from "@/interfaces/table";
import {
  Check,
  Delete,
  SetUp,
  CopyDocument,
  Plus,
  Setting,
} from "@element-plus/icons-vue";
import EditorTable from "./EditorTable.vue";
import Table from "./Table.vue";

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
  (e: "handleClone", value: OptionLayout): void;
  (e: "handleSave", value: OptionLayout): void;
  (e: "handleDelete", value: OptionLayout): void;
  (e: "handleDefault", value: OptionLayout): void;
  (e: "handleCopy", value: OptionLayout): void;
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

const isDisabled = (
  action: "isClone" | "isEdit" | "isCopy" | "isDefault" | "isDelete"
) => {
  const selected = props.optionsLayout.find(
    (item) => item.value === selectedTemplate.value.value
  );
  return selected?.actions ? !selected?.actions?.[action] : false;
};

const selectedTemplate = ref<any>(props.defaultValue || props.optionsLayout[0]);
const selectLayout = ref<any>(props.defaultValue || props.optionsLayout[0]);
const dialogVisible = ref(props.dialogVisible);

const handleClone = () => {
  emit("handleClone", selectedTemplate.value);
};
const handleSave = () => {
  emit("handleSave", selectedTemplate.value);
};
const handleDelete = () => {
  emit("handleDelete", selectedTemplate.value);
};
const handleDefault = () => {
  emit("handleDefault", selectedTemplate.value);
};
const handleCopy = () => {
  emit("handleCopy", selectedTemplate.value);
};
const onText = (data: VfField[]) => {
  emit("onText", data);
};
const displayedButtons = computed(() => {
  return props.optionsLayout.slice(0, props.maxActions);
});

const handleOpen = () => {
  dialogVisible.value = true;
  emit("handleOpen", true);
};
const handleClose = () => {
  emit("handleClose", false);
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

///
const columnsEdit = ref<Column[]>(
  props.columns.map((column) => {
    return {
      ...column,
      isDrag: false,
    };
  })
);

const onCta = (action: string, row: any, index: number) => {
  emit("onCta", action, row, index);
};
</script>

<style lang="scss" scoped>
pre {
  margin: 0;
  padding: 0;
}

.link {
  color: blue;
  cursor: pointer;
}

.action-box {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  padding-left: 0;
  gap: 5px;
  flex-wrap: wrap;
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
</style>
