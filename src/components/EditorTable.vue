<template>
  <div class="" :style="{ height: `${height}px` }">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
        <el-card>
          <template #header>
            <el-row justify="space-between" style="padding: 0" align="middle">
              <el-col :span="12">
                <slot name="columns"><span class="font-bold">Cột</span></slot>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-tooltip content="Thêm cột" placement="top">
                  <el-button
                    style="margin-right: 12px"
                    :disabled="disabled"
                    @click="onAddColumn"
                    circle
                    size="small"
                    type="primary"
                    >✚</el-button
                  >
                </el-tooltip>
              </el-col>
            </el-row>
          </template>
          <el-scrollbar :style="{ height: `${height - 45}px` }">
            <draggable
              tag="ul"
              v-model="columnsEdit"
              handle=".handle"
              ghost-class="ghost"
              :sort="!disabled"
              class="dragArea list-group"
            >
              <li
                v-for="(element, index) in columnsEdit"
                :key="index"
                class="list-group-item"
                :class="{
                  hover: element.isDrag,
                  active: activeIndex === index,
                }"
                style=""
                @click="!disabled && (activeIndex = index)"
              >
                <el-card
                  shadow="hover"
                  :body-style="{
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                  }"
                >
                  <div
                    class="label align-items-center"
                    @drop="(e) => onDrop(e, element, index)"
                    @dragover="(e) => onDragover(e, element)"
                    @dragleave="(e) => onDragleave(e, element)"
                  >
                    <el-row
                      align="middle"
                      style="width: 190px; margin-right: 5px"
                      :gutter="5"
                    >
                      <el-col :span="3">
                        <span class="handle">☰</span>
                      </el-col>
                      <el-col :span="4">
                        <el-popover
                          placement="right"
                          :width="170"
                          trigger="click"
                          :disabled="disabled"
                        >
                          <template #reference>
                            <el-button
                              size="small"
                              style="padding-left: 5px; padding-right: 5px"
                              :disabled="disabled"
                            >
                              ⋯
                            </el-button>
                          </template>
                          <template #default>
                            <div class="popover-action">
                              <el-row :gutter="10">
                                <el-col :span="24">
                                  <el-button-group>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        (element.align || 'left') === 'left'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.align = 'left'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="AlignLeftIcon"
                                      />
                                    </el-button>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        element.align === 'center'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.align = 'center'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="AlignCenterIcon"
                                      />
                                    </el-button>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        element.align === 'right'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.align = 'right'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="AlignRightIcon"
                                      />
                                    </el-button>
                                  </el-button-group>
                                </el-col>
                              </el-row>

                              <el-row :gutter="10" style="margin-top: 10px">
                                <el-col :span="24">
                                  <el-button-group>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        (element.vAlign || 'top') === 'top'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.vAlign = 'top'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="VerticalAlignTopIcon"
                                      />
                                    </el-button>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        element.vAlign === 'middle'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.vAlign = 'middle'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="VerticalAlignCenterIcon"
                                      />
                                    </el-button>
                                    <el-button
                                      size="small"
                                      plain
                                      :type="
                                        element.vAlign === 'bottom'
                                          ? 'primary'
                                          : 'default'
                                      "
                                      @click="element.vAlign = 'bottom'"
                                    >
                                      <el-image
                                        style="width: 15px"
                                        :src="VerticalAlignBottomIcon"
                                      />
                                    </el-button>
                                  </el-button-group>
                                </el-col>
                              </el-row>

                              <el-row :gutter="10" style="margin-top: 10px">
                                <el-col :span="24">
                                  <el-form
                                    label-position="left"
                                    label-width="80px"
                                  >
                                    <el-form-item
                                      label="Width:"
                                      style="margin-bottom: 0"
                                    >
                                      <el-input
                                        size="small"
                                        v-model="element.width"
                                        placeholder="# px | %"
                                      />
                                    </el-form-item>
                                    <el-form-item
                                      label="Min-width:"
                                      style="margin-bottom: 0"
                                    >
                                      <el-input
                                        size="small"
                                        v-model="element.minWidth"
                                        placeholder="# px | %"
                                      />
                                    </el-form-item>
                                    <el-form-item
                                      label="Max-width:"
                                      style="margin-bottom: 0"
                                    >
                                      <el-input
                                        size="small"
                                        v-model="element.maxWidth"
                                        placeholder="# px | %"
                                      />
                                    </el-form-item>
                                  </el-form>
                                </el-col>
                              </el-row>
                            </div>
                          </template>
                        </el-popover>
                      </el-col>
                      <el-col :span="17">
                        <el-input
                          v-model="element.title"
                          :disabled="disabled"
                          size="small"
                          class="border-bottom-input"
                          placeholder="Tên cột"
                        />
                      </el-col>
                    </el-row>
                    <el-row style="width: calc(100% - 190px)">
                      <el-col :span="24">
                        <draggable
                          v-model="element.fieldCodes"
                          :options="{
                            group: 'fields',
                            animation: 200,
                          }"
                          style="
                            display: inline-flex;
                            flex-wrap: wrap;
                            gap: 8px;
                          "
                        >
                          <el-tag
                            v-for="(field, index) in element.fieldCodes"
                            :key="index"
                            draggable="true"
                            closable
                            effect="plain"
                            type="info"
                            class="grab"
                            @close="removeFieldFromColumn(element, index)"
                          >
                            <el-image
                              v-if="mapFieldInfo[field]?.vfType === VfType.ICON"
                              class="icon-selected"
                              :src="mapFieldInfo[field]?.value"
                            />
                            <span v-else>
                              {{ mapFieldInfo[field]?.vfTitle }}
                            </span>
                          </el-tag>
                        </draggable>
                        <span
                          v-if="!element.fieldCodes.length"
                          class="empty-field"
                        >
                          Kéo field vào đây</span
                        >
                      </el-col>
                    </el-row>
                  </div>
                  <el-button
                    @click.stop="closeIndex(index)"
                    :disabled="disabled"
                    type="danger"
                    size="small"
                    circle
                  >
                    ✘</el-button
                  >
                </el-card>
              </li>
            </draggable>
          </el-scrollbar>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="8">
        <el-card>
          <template #header>
            <span class="font-bold">Trường</span>
          </template>
          <el-scrollbar :height="height - 45">
            <ul class="list-field">
              <li v-for="field in listFields" :key="field.field">
                <div class="label">{{ field.title }}:</div>
                <el-space wrap>
                  <el-tag
                    v-for="vfield in field.variants"
                    :key="vfield.vfCode"
                    class="mx-1 grab"
                    effect="plain"
                    draggable="true"
                    @dragstart="(e: any) => onDragstart(e, vfield)"
                    @dblclick="onAddingField(vfield)"
                  >
                    {{ vfield.vfTitle }}
                  </el-tag>
                </el-space>
              </li>
            </ul>
          </el-scrollbar>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="5" :xl="8">
        <el-card>
          <template #header>
            <span class="font-bold">Tiện ích</span>
          </template>
          <el-scrollbar :height="height - 45">
            <el-collapse v-model="activeExtraNames" size="small" class="extra">
              <el-collapse-item title="Dấu phân cách" name="separator">
                <el-space wrap>
                  <el-tag
                    v-for="field in symbols"
                    :key="field.vfAcutalField"
                    @click="onAddingField(field)"
                    draggable="true"
                    @dragstart="(e: any) => onDragstart(e, field)"
                    class="separator grab"
                    effect="plain"
                  >
                    {{ field.vfTitle }}
                  </el-tag>
                </el-space>
              </el-collapse-item>
              <el-collapse-item title="Hành động" name="actions">
                <el-space wrap>
                  <el-tag
                    v-for="field in actions"
                    :key="field.vfAcutalField"
                    @click="onAddingField(field)"
                    draggable="true"
                    @dragstart="(e: any) => onDragstart(e, field)"
                    class="actions grab"
                    effect="plain"
                  >
                    {{ field.vfTitle }}
                  </el-tag>
                </el-space>
              </el-collapse-item>
              <el-collapse-item title="Biểu tượng" name="icons">
                <el-space wrap>
                  <el-tag
                    v-for="field in icons"
                    :key="field.vfAcutalField"
                    @click="onAddingField(field)"
                    draggable="true"
                    @dragstart="(e: any) => onDragstart(e, field)"
                    class="icons grab"
                    type="info"
                  >
                    <el-image
                      :src="field.value"
                      fit="contain"
                      :style="{ width: '16px', height: '16px' }"
                    />
                  </el-tag>
                </el-space>
              </el-collapse-item>
              <el-collapse-item title="Chữ" name="text">
                <template #title>
                  <el-space spacer="|">
                    <span>Nhãn</span>
                    <el-button
                      @click.stop="addNewTextField"
                      type="primary"
                      size="small"
                      circle
                      style="font-weight: 700; font-size: 14px"
                    >
                      +
                    </el-button>
                  </el-space>
                </template>
                <el-space wrap>
                  <el-popover
                    v-for="field in Object.values(textFieldsMap)"
                    :key="field.vfCode"
                    placement="right"
                    :width="260"
                    trigger="click"
                  >
                    <template #reference>
                      <el-tag
                        closable
                        draggable="true"
                        @dblclick="addFieldToActiveColumn(field)"
                        @dragstart="(e: any) => onDragstart(e, field)"
                        class="text-field grab"
                        effect="plain"
                        :style="computeTextStyle(field)"
                        @close="removeTextField(field.vfCode)"
                      >
                        {{ field.vfTitle }}
                      </el-tag>
                    </template>
                    <el-form
                      size="small"
                      label-width="45px"
                      @change="emit('onText', textFields)"
                    >
                      <el-form-item label="Text:">
                        <el-input
                          v-model="field.vfTitle"
                          @input="
                            updateTextField(field.vfCode, 'vfTitle', $event)
                          "
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="Style:">
                        <el-checkbox-group
                          v-model="field.fontStyle"
                          class="style-options"
                        >
                          <el-checkbox-button label="bold"
                            >B</el-checkbox-button
                          >
                          <el-checkbox-button label="italic"
                            >I</el-checkbox-button
                          >
                          <el-checkbox-button label="underline"
                            >U</el-checkbox-button
                          >
                          <el-checkbox-button label="line-through"
                            >─</el-checkbox-button
                          >
                          <el-checkbox-button label="overline"
                            >‾</el-checkbox-button
                          >
                        </el-checkbox-group>
                      </el-form-item>
                      <el-form-item label="Color:">
                        <el-radio-group
                          v-model="field.color"
                          class="color-options"
                        >
                          <el-radio-button
                            v-for="color in colorOptions"
                            :key="color"
                            :label="color"
                          >
                            <div
                              class="color-box"
                              :style="{ backgroundColor: color }"
                            />
                          </el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                  </el-popover>
                </el-space>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { VueDraggableNext as draggable } from "vue-draggable-next";
import { ElMessage } from "element-plus";
import { toJson } from "@/utils/parse";
import { VfField, VariantsField, Column, VfType } from "@/interfaces/table";
import { symbols } from "@/constants/symbols";
import AlignLeftIcon from "@/assets/icons/align-left.svg";
import AlignCenterIcon from "@/assets/icons/align-center.svg";
import AlignRightIcon from "@/assets/icons/align-right.svg";
import VerticalAlignTopIcon from "@/assets/icons/vertal-align-top.svg";
import VerticalAlignCenterIcon from "@/assets/icons/vertal-align-center.svg";
import VerticalAlignBottomIcon from "@/assets/icons/vertal-align-bottom.svg";
import "@/assets/style.scss";

interface Props {
  modelValue: Column[];
  vfFields: VfField[];
  actions: VfField[];
  icons: VfField[];
  height?: number;
  disabled?: boolean;
  colorOptions?: any;
  textFields: VfField[];
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  height: 390,
  colorOptions: [
    "#606266", // xám
    "#000000", // Đen
    "#FF0000", // Đỏ
    "#00FF00", // Xanh lá
    "#0000FF", // Xanh dương
    "#FFFF00", // Vàng
    "#FF00FF", // Hồng cánh sen
    "#00FFFF", // Xanh ngọc
    "#808080", // Xám
    "#800000", // Đỏ nâu
    "#008000", // Xanh lá đậm
    "#000080", // Xanh dương đậm
    "#FFA500", // Cam
    "#FFC0CB", // Hồng nhạt
    "#FFD700", // Vàng kim
    "#A52A2A", // Nâu
  ],
});

const emit = defineEmits<{
  (e: "update:modelValue", columnEdit: Column[]): void;
  (e: "error", s: string): void;
  (e: "onText", data: VfField[]): void;
}>();

const columnsEdit = computed({
  get() {
    return props.modelValue;
  },
  set(values: Column[]) {
    emit("update:modelValue", values);
  },
});

const activeExtraNames = ref(["separator", "actions", "icons", "text"]);

const columnsTemplate = computed(() => {
  return [
    ...symbols,
    ...props.actions,
    ...props.icons,
    ...props.vfFields,
    ...textFields.value,
  ];
});

const mapFieldInfo = computed(() => {
  return columnsTemplate.value.reduce(
    (map: { [vfCode: string]: VfField }, field: VfField) => {
      map[field.vfCode] = field;
      return map;
    },
    {}
  );
});

const activeIndex = ref(-1);

const listFields = computed<VariantsField[]>(() => {
  const mapField: { [field: string]: number } = {};
  const list: VariantsField[] = [];

  for (const vfField of props.vfFields) {
    const vfAcutalField = vfField?.vfAcutalField || "";
    if (mapField[vfAcutalField] === undefined) {
      list.push({
        title: vfField.vfActualFieldTitle || "",
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

const removeFieldFromColumn = (column: Column, index: number) => {
  if (index >= 0 && index < column.fieldCodes.length) {
    column.fieldCodes.splice(index, 1);
  }
};

const textFields = ref<VfField[]>(props.textFields);

const updateTextField = (
  vfCode: string,
  property: keyof VfField,
  value: any
) => {
  const field = textFields.value.find((f) => f.vfCode === vfCode);
  if (field) {
    field[property] = value;
  }
};

const computeTextStyle = (text: VfField) => {
  return {
    fontStyle: text.fontStyle?.includes("italic") ? "italic" : "normal",
    fontWeight: text.fontStyle?.includes("bold") ? "bold" : "normal",
    textDecoration: [
      text.fontStyle?.includes("underline") ? "underline" : "",
      text.fontStyle?.includes("line-through") ? "line-through" : "",
      text.fontStyle?.includes("overline") ? "overline" : "",
    ]
      .join(" ")
      .trim(),
    color: text.color || "#606266",
  };
};

const textFieldsMap = computed(() => {
  return textFields.value.reduce((acc, field) => {
    acc[field.vfCode] = field;
    return acc;
  }, {} as { [key: string]: VfField });
});

const removeTextField = (vfCode: string) => {
  textFields.value = textFields.value.filter(
    (field) => field.vfCode !== vfCode
  );
  columnsEdit.value.forEach((column) => {
    column.fieldCodes = column.fieldCodes.filter(
      (field: string | { vfCode: string }) =>
        typeof field === "string" ? field !== vfCode : field.vfCode !== vfCode
    );
  });
  emit("onText", textFields.value);
};

const addFieldToActiveColumn = (field: VfField) => {
  if (activeIndex.value >= 0 && activeIndex.value < columnsEdit.value.length) {
    const activeColumn = columnsEdit.value[activeIndex.value];
    activeColumn.fieldCodes.push(field.vfCode);
    textFields.value.push(field);
  } else {
    ElMessage.warning("Please select a column before adding a field.");
  }
};

const addNewTextField = () => {
  const newIndex = textFields.value.length + 1;
  const newTextField: VfField = {
    vfCode: `text_0${newIndex}`,
    vfTitle: `New Text ${newIndex}`,
    vfType: VfType.TEXT,
    color: "#606266",
    fontStyle: [],
  };
  textFields.value.push(newTextField);
  emit("onText", textFields.value);
};

// end new
const onAddColumn = () => {
  emit("update:modelValue", [
    ...props.modelValue,
    {
      title: "",
      fieldCodes: [],
      isDrag: false,
    },
  ]);
};

const onDragstart = (e: any, field: VfField) => {
  e.dataTransfer.setData("text", JSON.stringify(field));
};

const onDragover = (e: any, colum: Column) => {
  if (props.disabled) {
    return false;
  }
  e.preventDefault();
  colum.isDrag = true;
};

const onDragleave = (e: any, colum: Column) => {
  if (props.disabled) {
    return false;
  }
  e.preventDefault();
  colum.isDrag = false;
};

const onDrop = (e: any, column: Column, index: number) => {
  if (props.disabled) {
    return false;
  }
  e.preventDefault();
  const data = toJson(e.dataTransfer.getData("text"));
  if (data && data.vfCode) {
    if (data.isTextField) {
      column.fieldCodes.push(data);
    } else {
      column.fieldCodes.push(data.vfCode);
    }
  }
  column.isDrag = false;
  activeIndex.value = index;
};

const closeIndex = (index: number) => {
  const values = props.modelValue;
  const column = values[index];
  if (column.fieldCodes.length > 0) {
    column.fieldCodes.pop();
  } else {
    values.splice(index, 1);
    activeIndex.value = -1;
  }
  emit("update:modelValue", values);
};

const onAddingField = (field: VfField) => {
  if (props.disabled) return;
  if (activeIndex.value >= 0) {
    const column = columnsEdit.value[activeIndex.value];
    column && column.fieldCodes.push(field.vfCode);
  } else {
    emit("error", "Hãy chọn column để thêm");
  }
};
</script>

<style lang="scss" scoped>
ul.list-group {
  padding-left: 0;
  overflow-y: auto;
  margin: 0;
  list-style: none;
  li.list-group-item {
    border: 2px solid #ffffff;
    margin-bottom: 5px;
    border-radius: 5px;
    &.hover {
      border-color: #f00;
    }
    &.sortable-chosen {
      border-color: #94d53b;
      cursor: move;
    }
    &.active {
      border-color: #94d53b;
    }
    .label {
      width: 100%;
      .border-bottom-input {
        :deep(.el-input__wrapper) {
          box-shadow: none;
          border-radius: 0;
          border-bottom: 1px solid #dcdfe6;
        }
      }

      .empty-field {
        color: gray;
        font-size: 12px;
      }
      .handle {
        cursor: move;
        font-size: 20px;
      }
      .icon-selected {
        width: 12px;
      }
      .btn-more {
        cursor: pointer;
        margin: 0 2px;

        &:hover,
        &.active {
          color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
        img {
          width: 20px;
          width: 20px;
        }
      }
    }
  }
}
ul.list-field {
  padding-left: 0;
  list-style: none;
  margin: 0;
  li {
    white-space: nowrap;
    padding: 5px;
    display: flex;
    align-items: center;
    .label {
      font-size: 12px;
      margin-right: 10px;
    }
  }
}
.extra {
  :deep(.el-collapse-item__content) {
    padding-bottom: 15px;
  }
  :deep(.el-collapse-item__header) {
    height: 34px;
  }
  .separator {
    font-weight: bold;
  }
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  .color-box {
    width: 16px;
    height: 16px;
    border: 1px solid rgb(189, 189, 189);
  }
  :deep(.el-radio-button__inner) {
    padding: 1px !important;
  }
}

.grab {
  cursor: grab;
}
.font-bold {
  font-weight: bold;
}
:deep(.el-collapse) {
  border-top: 0;
}
:deep(.el-card__body) {
  padding: 10px;
}
:deep(.el-card__header) {
  padding: 10px;
  height: 45px;
}
:deep(.el-form--inline .el-form-item) {
  margin: 0;
}
</style>
