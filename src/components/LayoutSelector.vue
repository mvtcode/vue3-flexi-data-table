<template>
  <el-space>
    <span>{{ label }}:</span>
    <!-- Visible Buttons -->
    <template v-for="button in visibleButtons" :key="button.value">
      <el-button
        size="small"
        plain
        :type="isActiveButton(button.value) ? 'success' : 'primary'"
        @click="handleLayoutChange(button.value)"
      >
        {{ button.label }}
      </el-button>
    </template>

    <!-- Dropdown for remaining items -->
    <el-dropdown
      v-if="dropdownItems.length > 0"
      trigger="click"
      @command="handleLayoutChange"
    >
      <el-button size="small" plain>
        <el-icon>
          <CaretBottom />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in dropdownItems"
            :key="item.value"
            :command="item.value"
            :class="{ 'active-item': isActiveButton(item.value) }"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MoreFilled, CaretBottom } from "@element-plus/icons-vue";

interface OptionLayout {
  value: string | number;
  label: string;
}

interface Props {
  options: OptionLayout[];
  maxVisible?: number;
  modelValue?: string | number;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 4,
  label: "Giao diện",
  modelValue: "",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", option: any): void;
}>();

// Compute visible buttons and dropdown items
const visibleButtons = computed(() => {
  return props.options.slice(0, props.maxVisible);
});

const dropdownItems = computed(() => {
  return props.options.slice(props.maxVisible);
});

// Check if button is active
const isActiveButton = (value: string | number) => {
  return props.modelValue === value;
};

// Handle layout change
const handleLayoutChange = (value: string | number) => {
  const selectedOption = props.options.find((item) => item.value === value);
  if (selectedOption) {
    emit("update:modelValue", value);
    emit("change", selectedOption);
  }
};
</script>

<style scoped>
.el-dropdown {
  margin-left: 4px;
}

.el-button .el-icon {
  display: flex;
  align-items: center;
}

:deep(.active-item) {
  color: var(--el-color-primary);
  font-weight: bold;
}

.mr-1 {
  margin-right: 4px;
}
</style>
