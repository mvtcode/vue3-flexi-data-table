<template>
  <div v-if="isShow" class="popup-edit-label">
    <div class="popup-content">
      <div class="input-group">
        <label>Tiêu đề:</label>
        <input ref="inputTitleRef" class="input-title" v-model="labelData.title" type="text" placeholder="Nhập tiêu đề...">
      </div>

      <div v-if="presets && presets.length > 0" class="input-group presets-section">
        <label>Mẫu có sẵn:</label>
        <div class="presets-list">
          <span 
            v-for="preset in presets" 
            :key="preset.name"
            class="preset-item"
            @click="applyPreset(preset)"
          >
            <span 
              class="preset-preview"
              :style="{
                color: preset.style.color,
                backgroundColor: preset.style.backgroundColor,
                fontWeight: preset.style.fontWeight,
                fontStyle: preset.style.fontStyle,
                textDecoration: preset.style.textDecoration
              }"
            >
              {{ preset.name }}
            </span>
          </span>
        </div>
      </div>

      <div class="input-group">
        <label>Màu chữ:</label>
        <div class="color-picker">
          <div class="color-input-group">
            <input v-model="labelData.style!.color" type="color">
            <input 
              v-model="labelData.style!.color" 
              type="text" 
              class="hex-input"
              placeholder="#000000"
            >
          </div>
          <div class="quick-colors">
            <button 
              v-for="color in textColors" 
              :key="color"
              :style="{ backgroundColor: color }"
              @click="labelData.style!.color = color"
            ></button>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label>Màu nền:</label>
        <div class="color-picker">
          <div class="color-input-group">
            <input v-model="labelData.style!.backgroundColor" type="color">
            <input 
              v-model="labelData.style!.backgroundColor" 
              type="text" 
              class="hex-input"
              placeholder="#ffffff"
            >
          </div>
          <div class="quick-colors">
            <button 
              v-for="color in bgColors" 
              :key="color"
              :style="{ backgroundColor: color }"
              @click="labelData.style!.backgroundColor = color"
            ></button>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label>Style:</label>
        <div class="style-buttons">
          <button 
            :class="{ active: labelData.style!.fontWeight === 'bold' }"
            @click="toggleStyle('fontWeight')"
          >
            B
          </button>
          <button 
            :class="{ active: labelData.style!.fontStyle === 'italic' }"
            @click="toggleStyle('fontStyle')"
          >
            I
          </button>
          <button 
            :class="{ active: labelData.style!.textDecoration === 'underline' }"
            @click="toggleStyle('textDecoration')"
          >
            U
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>Chiều rộng:</label>
        <div class="width-input">
          <input 
            v-model="labelData.style!.width" 
            type="text" 
            class="width-value"
            placeholder="auto"
          >
          <select v-model="labelData.style!.widthUnit" class="width-unit">
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button class="btn-cancel" @click="handleCancel">Hủy</button>
        <button class="btn-save" @click="handleSave" :disabled="!labelData.title">Lưu</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, nextTick, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { LabelField, LabelPreset } from '@/interfaces/table'

interface Props {
  presets?: LabelPreset[]
}
const props = withDefaults(defineProps<Props>(), {
  presets: () => []
});

const emit = defineEmits<{
  (e: 'save', value: LabelField): void
}>()

const inputTitleRef = ref<HTMLInputElement>()
const isShow = ref(false)

const labelData = ref<LabelField>({
  title: '',
  code: '',
  style: {
    color: '#000000',
    backgroundColor: '#ffffff',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    width: 'auto',
    widthUnit: 'px'
  }
})

const textColors = [
  '#000000', "#999999", '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'
]

const bgColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', 'transparent'
]

const toggleStyle = (style: string) => {
  if (!labelData.value.style) return
  
  switch(style) {
    case 'fontWeight':
      labelData.value.style.fontWeight = labelData.value.style.fontWeight === 'bold' ? 'normal' : 'bold'
      break
    case 'fontStyle':
      labelData.value.style.fontStyle = labelData.value.style.fontStyle === 'italic' ? 'normal' : 'italic'
      break
    case 'textDecoration':
      labelData.value.style.textDecoration = labelData.value.style.textDecoration === 'underline' ? 'none' : 'underline'
      break
  }
}

const handleCancel = () => {
  isShow.value = false
}

const handleSave = () => {
  emit('save', labelData.value)
  isShow.value = false
}

const show = (data?: LabelField) => {
  isShow.value = true
  if (data) {
    // Update mode
    labelData.value = {
      title: data.title,
      code: data.code,
      style: {
        color: data.style?.color || '#000000',
        backgroundColor: data.style?.backgroundColor || 'transparent',
        fontWeight: data.style?.fontWeight || 'normal',
        fontStyle: data.style?.fontStyle || 'normal',
        textDecoration: data.style?.textDecoration || 'none',
        width: data.style?.width || 'auto',
        widthUnit: data.style?.widthUnit || 'px'
      }
    }
  } else {
    // Add new mode
    labelData.value = {
      title: '',
      code: uuidv4(),
      style: {
        color: '#000000',
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        width: 'auto',
        widthUnit: 'px'
      }
    }
  }

  nextTick(() => {
    inputTitleRef.value?.focus()
  })
};

const applyPreset = (preset: LabelPreset) => {
  if (!labelData.value.style) return
  labelData.value.style = { ...preset.style }
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.popup-edit-label {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;

  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .presets-section {
      .presets-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .preset-item {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0;
        cursor: pointer;
        overflow: hidden;
        transition: transform 0.2s;
        display: inline-block;

        &:hover {
          transform: scale(1.05);
        }

        .preset-preview {
          display: block;
          padding: 8px 10px;
          font-size: 14px;
        }
      }
    }

    .input-group {
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      gap: 10px;

      label {
        min-width: 80px;
        margin-top: 8px;
        font-weight: 500;
      }

      input[type="text"] {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;

        &.input-title {
          font-size: 16px;
          font-weight: 500;
          outline: none;
        }

        &:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      }

      .color-picker {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .color-input-group {
          display: flex;
          align-items: center;
          gap: 10px;

          input[type="color"] {
            height: 35px;
            padding: 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .hex-input {
            width: 100px !important;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
          }
        }

        .quick-colors {
          display: flex;
          gap: 5px;
          
          button {
            width: 25px;
            height: 25px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            padding: 0;

            &:hover {
              transform: scale(1.1);
            }

            &[style*="transparent"] {
              background: linear-gradient(45deg, transparent 48%, #ff0000 48%, #ff0000 52%, transparent 52%);
            }
          }
        }
      }

      .style-buttons {
        display: flex;
        gap: 10px;

        button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s;

          &.active {
            background-color: #e0e0e0;
            border-color: #999;
          }

          &:hover {
            background-color: #f5f5f5;
          }
        }
      }

      .width-input {
        flex: 1;
        display: flex;
        gap: 10px;
        align-items: center;

        .width-value {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .width-unit {
          width: 60px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
        }
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;

      button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;

        &.btn-cancel {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          color: #666;
        }

        &.btn-save {
          background-color: #4CAF50;
          border: none;
          color: white;

          &:hover {
            background-color: #45a049;
          }

          &:disabled {
            background-color: #999;
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>