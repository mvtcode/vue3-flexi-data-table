# Vue3 Flexi Data Table

A flexible data table component for Vue 3 with rich features.

## Features

- 🔄 Dynamic column configuration
- 📱 Responsive design
- ✨ Rich data display options
- 🎯 Custom field rendering
- 🔍 Column sorting
  - Configure sortable fields in column editor
  - Click header to cycle through sort states (ascending → descending → no sort)
  - Only one column can be sorted at a time
- ✅ Row selection
  - Single/Multiple row selection
  - Select all/Deselect all
  - Get/Set selected rows programmatically
- 🎨 Flexible styling
  - Column alignment (horizontal & vertical)
  - Custom width settings (fixed, min, max)
  - Custom CSS for header and cells
- 🏷️ Label system
  - Create and manage custom labels
  - Style labels with colors and sizes
- 🛠️ Rich customization options
  - Column reordering via drag & drop
  - Column type support (data/select)
  - Symbol and icon integration

## Screenshot

![Screenshot](./screenshot.png)

## License

MIT

## Author

### Tanmv

- GitHub: [tanmv](https://github.com/mvtcode)

### Contact for work

- Email: tanmv@mpos.vn
- Telegram: @tanmac
- Skype: trai_12a1

## Installation

```bash
npm install vue3-flexi-data-table
```

## Components

### DynamicTable

The main table component that displays data with configured columns.

```vue
<template>
  <DynamicTable 
    :columns="columns"
    :data="data"
    :templates="templates"
    :labels="labels"
    :height="400"
    :fixed="true"
    @sortChange="handleSort"
    @selectChange="handleSelect"
    @onCta="handleAction"
  />
</template>
```

### TableEditor

A component for configuring table columns with drag-and-drop support.

```vue
<template>
  <TableEditor
    v-model="columns"
    :vfFields="fields"
    :actions="actions"
    :icons="icons"
    :labels="labels"
    :height="400"
    @update:labels="handleLabelUpdate"
  />
</template>
```

## Usage Examples

### Basic Table with Sorting

```vue
<template>
  <DynamicTable 
    :columns="columns"
    :data="data"
    @sortChange="handleSort"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DynamicTable } from 'vue3-flexi-data-table';

const columns = ref([
  {
    title: 'Name',
    fieldCodes: ['name'],
    sortField: 'name' // Enable sorting for this column
  },
  {
    title: 'Age',
    fieldCodes: ['age'],
    sortField: 'age',  // Enable sorting for this column
    align: 'right'     // Right align numbers
  }
]);

const data = ref([
  { name: 'John Doe', age: 30 },
  { name: 'Jane Smith', age: 25 },
  // ... more data
]);

// Handle sort changes
const handleSort = (sort) => {
  const { field, direction } = sort;
  // Implement your sorting logic here
};
</script>
```

### Table with Selection

```vue
<template>
  <DynamicTable 
    ref="tableRef"
    :columns="columns"
    :data="data"
    @selectChange="handleSelect"
  />
  <button @click="selectFirstRow">Select First Row</button>
  <button @click="clearSelection">Clear Selection</button>
</template>

<script setup>
import { ref } from 'vue';
import { DynamicTable } from 'vue3-flexi-data-table';

const tableRef = ref();
const columns = ref([
  {
    type: 'SELECT',    // Add checkbox column
    width: '40px'
  },
  {
    title: 'Name',
    fieldCodes: ['name']
  }
]);

// Handle selection changes
const handleSelect = (selectedRows) => {
  console.log('Selected rows:', selectedRows);
};

// Example of using table methods
const selectFirstRow = () => {
  tableRef.value.setSelect([0]);
};

const clearSelection = () => {
  tableRef.value.clearSelect();
};
</script>
```

### Table with Custom Templates

```vue
<template>
  <DynamicTable 
    :columns="columns"
    :data="data"
    :templates="templates"
  />
</template>

<script setup>
import { ref } from 'vue';
import { DynamicTable } from 'vue3-flexi-data-table';

const templates = ref([
  {
    vfCode: 'status',
    vfType: 'DATA',
    vfRenderFunc: (row) => {
      return row.status === 'active' ? '🟢 Active' : '🔴 Inactive';
    }
  }
]);

const columns = ref([
  {
    title: 'Status',
    fieldCodes: ['status']
  }
]);

const data = ref([
  { status: 'active' },
  { status: 'inactive' }
]);
</script>
```

### FlexiTable Component

FlexiTable là component chính của thư viện, cung cấp đầy đủ các tính năng như quản lý layout, sorting, filtering, và custom templates.

```vue
<template>
  <FlexiTable
    ref="flexiTableRef"
    v-model="layoutId"
    :layouts="layouts"
    :templates="vfFields"
    :actions="actions"
    :icons="icons"
    :data="dataTable"
    :label-presets="labelPresets"
    @onCta="onCta"
    @error="onErrorHandle"
    @save="onSaveHandle"
    @remove="onRemoveHandle"
    @setDefault="onSetDefaultHandle"
    @selectChange="onSelectChange"
    @sortChange="onSortChange"
  >
    <template #actions>
      <button @click="getSelect">Get Select</button>
      <button @click="setSelect([1, 2, 3])">Set Select</button>
      <button @click="clearSelect">Clear Select</button>
    </template>
  </FlexiTable>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import FlexiTable from 'vue3-flexi-data-table'
import { VfField, VfType, LayoutTemplate, LabelPreset, Column, ColumnType } from 'vue3-flexi-data-table'

// Định nghĩa label presets
const labelPresets: LabelPreset[] = [
  {
    name: 'Mẫu 1',
    style: {
      color: '#999999',
      backgroundColor: 'transparent',
      fontWeight: '',
      fontStyle: '',
      textDecoration: '',
    },
  },
]

// Định nghĩa các trường dữ liệu (templates)
const vfFields: VfField[] = [
  {
    vfTitle: 'Mã SV',
    vfCode: 'id',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    vfActualFieldTitle: 'Mã SV',
  },
  {
    vfTitle: 'Họ Tên',
    vfCode: 'name',
    vfType: VfType.DATA,
    vfAcutalField: 'name',
    vfActualFieldTitle: 'Họ tên',
  },
  // Custom template với render function
  {
    vfTitle: 'Giới tính',
    vfCode: 'gender2',
    vfType: VfType.DATA,
    vfAcutalField: 'gender',
    vfActualFieldTitle: 'Giới tính',
    vfRenderFunc: (row: any) => {
      const span = document.createElement('span')
      span.style.color = row.gender === 'Nam' ? 'red' : 'blue'
      span.textContent = row.gender
      return span.outerHTML
    },
  },
]

// Định nghĩa các actions
const actions: VfField[] = [
  {
    vfTitle: 'Xem',
    vfCode: 'detail',
    vfType: VfType.ACTION,
  },
  {
    vfTitle: 'Sửa',
    vfCode: 'update',
    vfType: VfType.ACTION,
  },
  {
    vfTitle: 'Xóa',
    vfCode: 'delete',
    vfType: VfType.ACTION,
  },
]

// Định nghĩa layout mặc định
const defaultLayouts: LayoutTemplate[] = [
  {
    title: 'Mặc định',
    id: '11111111-1111-1111-1111-111111111111',
    isSystem: true,
    columns: [
      { title: 'Select', fieldCodes: [], isDrag: false, type: ColumnType.SELECT, align: 'center' },
      { title: 'Mã sinh viên', fieldCodes: ['id'], sortField: 'id', type: ColumnType.DATA },
      { title: 'Họ và tên', fieldCodes: ['name'], type: ColumnType.DATA, sortField: 'name' },
      { title: 'Giới tính', fieldCodes: ['gender2'], type: ColumnType.DATA },
      {
        title: 'Actions',
        fieldCodes: ['detail', 'space', 'update', 'space', 'delete'],
        type: ColumnType.DATA,
      },
    ],
  },
]

// State management
const layoutId = ref(defaultLayouts[0].id)
const layouts = ref<LayoutTemplate[]>(defaultLayouts)
const sortConfig = reactive<{ field?: string; direction?: 'asc' | 'desc' }>({})
const flexiTableRef = ref()

// Event handlers
const onCta = (action: string, row: any, index: number) => {
  console.log(action, row, index)
}

const onErrorHandle = (msg: string) => {
  alert(msg)
}

const onSaveHandle = (layout: LayoutTemplate, cb: () => void) => {
  // Lưu layout vào localStorage
  const saveId = layout.id
  localStorage.setItem(`flexi-layout.${saveId}`, JSON.stringify(layout))
  cb()
}

const onRemoveHandle = (id: string, cb: () => void) => {
  // Xóa layout khỏi localStorage
  localStorage.removeItem(`flexi-layout.${id}`)
  cb()
}

const onSetDefaultHandle = (id: string, cb: () => void) => {
  // Đặt layout mặc định
  localStorage.setItem('flexi-layout.default', id)
  layoutId.value = id
  cb()
}

const onSelectChange = (selectedRows: number[]) => {
  console.log('Selected rows:', selectedRows)
}

const onSortChange = ({ field, direction }: { field?: string; direction?: 'asc' | 'desc' }) => {
  sortConfig.field = field
  sortConfig.direction = direction
}

// Table methods
const getSelect = () => {
  console.log(flexiTableRef.value?.getSelect())
}

const setSelect = (indexes: number[]) => {
  flexiTableRef.value?.setSelect(indexes)
}

const clearSelect = () => {
  flexiTableRef.value?.clearSelect()
}

// Load saved layouts on mount
onMounted(() => {
  // Load layouts from localStorage
  const savedLayouts = Object.keys(localStorage)
    .filter(key => key.startsWith('flexi-layout.'))
    .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
  
  layouts.value.push(...savedLayouts)
  
  // Load default layout
  const defaultId = localStorage.getItem('flexi-layout.default')
  if (defaultId) {
    layoutId.value = defaultId
  }
})
</script>

### FlexiTable Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| v-model | string | Yes | ID của layout đang được chọn |
| layouts | LayoutTemplate[] | Yes | Danh sách các layout có sẵn |
| templates | VfField[] | Yes | Định nghĩa các trường dữ liệu |
| actions | VfField[] | No | Định nghĩa các action |
| icons | VfField[] | No | Định nghĩa các icon |
| data | any[] | Yes | Dữ liệu hiển thị trong bảng |
| label-presets | LabelPreset[] | No | Các mẫu label định sẵn |

### FlexiTable Events

| Event | Parameters | Description |
|-------|------------|-------------|
| onCta | (action: string, row: any, index: number) | Khi người dùng click vào action |
| error | (message: string) | Khi có lỗi xảy ra |
| save | (layout: LayoutTemplate, callback: () => void) | Khi lưu layout |
| remove | (id: string, callback: () => void) | Khi xóa layout |
| setDefault | (id: string, callback: () => void) | Khi đặt layout mặc định |
| selectChange | (selectedRows: number[]) | Khi thay đổi selection |
| sortChange | ({ field?: string, direction?: 'asc' \| 'desc' }) | Khi thay đổi sort |

### FlexiTable Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| getSelect | () | Lấy danh sách các row đang được chọn |
| setSelect | (indexes: number[]) | Chọn các row theo index |
| clearSelect | () | Xóa tất cả selection |

## Props

### DynamicTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | Column[] | [] | Array of column configurations |
| data | any[] | [] | Array of data to display |
| templates | VfField[] | [] | Array of field templates |
| labels | LabelField[] | [] | Array of label configurations |
| height | number | - | Fixed height of the table |
| fixed | boolean | false | Whether to fix the table height |

### TableEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| modelValue | Column[] | [] | Array of column configurations |
| vfFields | VfField[] | [] | Array of field templates |
| actions | VfField[] | [] | Array of action templates |
| icons | VfField[] | [] | Array of icon templates |
| labels | LabelField[] | [] | Array of label configurations |
| height | number | 390 | Height of the editor |
| disabled | boolean | false | Whether the editor is disabled |
| labelPresets | LabelPreset[] | [] | Array of label style presets |

## Events

### DynamicTable Events

| Event | Parameters | Description |
|-------|------------|-------------|
| sortChange | { field: string, direction: 'asc' \| 'desc' } | Emitted when sort changes |
| selectChange | number[] | Emitted when selection changes |
| onCta | (action: string, row: any, index: number) | Emitted when a custom action is triggered |

### TableEditor Events

| Event | Parameters | Description |
|-------|------------|-------------|
| update:modelValue | Column[] | Emitted when columns are updated |
| update:labels | LabelField[] | Emitted when labels are updated |
| error | string | Emitted when an error occurs |

## Advanced Examples

### Icons Integration

```vue
<template>
  <FlexiTable
    :templates="vfFields"
    :icons="icons"
    :data="data"
  />
</template>

<script setup lang="ts">
import { VfField, VfType } from 'vue3-flexi-data-table'

// Định nghĩa icons
const icons: VfField[] = [
  {
    vfTitle: 'bookmark',
    vfCode: 'bookmark',
    vfType: VfType.ICON,
    vfActualFieldTitle: 'bookmark',
    value: '/icons/bookmark.png',
  },
  {
    vfTitle: 'star',
    vfCode: 'star',
    vfType: VfType.ICON,
    vfActualFieldTitle: 'star',
    value: '/icons/star.png',
  },
]

// Sử dụng icons trong columns
const defaultLayouts = [
  {
    title: 'Default',
    id: 'default-layout',
    columns: [
      {
        title: 'Status',
        fieldCodes: ['star', 'space', 'status'],
        type: ColumnType.DATA
      }
    ]
  }
]
</script>
```

### Advanced Templates

```vue
<script setup lang="ts">
// Template với custom format
const vfFields: VfField[] = [
  // Template với format string
  {
    vfTitle: 'MSV Format',
    vfCode: 'id-format',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    templateShow: 'MSV: {{value}}',
  },
  
  // Template với render function
  {
    vfTitle: 'Custom Render',
    vfCode: 'custom-render',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    vfRenderFunc: (_row, _column, _index, _calFunc, value) => {
      const strong = document.createElement('strong')
      strong.style.color = '#F00'
      strong.textContent = value
      return `ID: ${strong.outerHTML}`
    },
  },

  // Template với enum mapping
  {
    vfTitle: 'Status',
    vfCode: 'status',
    vfType: VfType.DATA,
    vfAcutalField: 'status',
    enum: {
      dropout: 'Thôi học',
      studying: 'Đang học',
      graduate: 'Tốt nghiệp',
    },
  },

  // Template với nested data
  {
    vfTitle: 'Địa chỉ',
    vfCode: 'address',
    vfType: VfType.DATA,
    vfAcutalField: 'address.provinceName',
  },

  // Template với array data
  {
    vfTitle: 'Khóa học',
    vfCode: 'courses',
    vfType: VfType.DATA,
    vfAcutalField: 'courses',
    templateShow: '<div>{{$item}}</div>', // Hiển thị mỗi item trên một dòng
  },
]
</script>
```

### Custom Styling

```vue
<template>
  <FlexiTable
    :templates="vfFields"
    :label-presets="labelPresets"
    :layouts="layouts"
  />
</template>

<script setup lang="ts">
// Label presets cho styling
const labelPresets: LabelPreset[] = [
  {
    name: 'Success',
    style: {
      color: '#155724',
      backgroundColor: '#d4edda',
      fontWeight: 'bold',
      padding: '2px 8px',
      borderRadius: '4px',
    },
  },
  {
    name: 'Warning',
    style: {
      color: '#856404',
      backgroundColor: '#fff3cd',
      fontWeight: 'bold',
      padding: '2px 8px',
      borderRadius: '4px',
    },
  },
]

// Layout với custom styling
const layouts = [
  {
    title: 'Styled Layout',
    id: 'styled-layout',
    columns: [
      {
        title: 'Status',
        fieldCodes: ['status'],
        type: ColumnType.DATA,
        align: 'center',      // Căn giữa ngang
        vAlign: 'middle',     // Căn giữa dọc
        width: '120px',       // Chiều rộng cố định
        minWidth: '100px',    // Chiều rộng tối thiểu
        maxWidth: '150px',    // Chiều rộng tối đa
      }
    ],
    labels: [
      {
        code: 'status-label',
        title: 'Status',
        style: {
          fontSize: '13px',
          color: 'red',
          backgroundColor: '#f8f9fa',
          padding: '4px 8px',
          borderRadius: '4px',
        },
      },
    ],
  }
]
</script>
```

### Layout Management

```vue
<template>
  <FlexiTable
    v-model="layoutId"
    :layouts="layouts"
    @save="onSaveHandle"
    @remove="onRemoveHandle"
    @setDefault="onSetDefaultHandle"
  />
</template>

<script setup lang="ts">
// Layout persistence với localStorage
const keyStore = 'flexi-layout'

const onSaveHandle = (layout: LayoutTemplate, cb: () => void) => {
  const saveId = layout.id
  localStorage.setItem(`${keyStore}.${saveId}`, JSON.stringify(layout))
  cb()
}

const onRemoveHandle = (id: string, cb: () => void) => {
  localStorage.removeItem(`${keyStore}.${id}`)
  cb()
}

const onSetDefaultHandle = (id: string, cb: () => void) => {
  localStorage.setItem(`${keyStore}.default`, id)
  layoutId.value = id
  cb()
}

// Load layouts khi component mounted
onMounted(() => {
  // Load layouts từ localStorage
  const savedLayouts = Object.keys(localStorage)
    .filter(key => key.startsWith(keyStore))
    .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
  
  layouts.value.push(...savedLayouts)
  
  // Load default layout
  const defaultId = localStorage.getItem(`${keyStore}.default`)
  if (defaultId) {
    layoutId.value = defaultId
  }
})
</script>
```

### Complete Type Definitions

```typescript
// VfField type
interface VfField {
  vfTitle: string;
  vfCode: string;
  vfType: VfType;
  vfAcutalField?: string;
  vfActualFieldTitle?: string;
  templateShow?: string;
  vfRenderFunc?: (row: any, column?: VfField, index?: number, calFunc?: string, value?: any) => string;
  enum?: { [key: string]: string };
  value?: string;
}

// Column type
interface Column {
  title: string;
  fieldCodes: string[];
  type?: ColumnType;
  sortField?: string;
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  isDrag?: boolean;
}

// Layout template type
interface LayoutTemplate {
  title: string;
  id: string;
  isSystem?: boolean;
  columns: Column[];
  labels?: LabelField[];
}

// Label field type
interface LabelField {
  code: string;
  title: string;
  style?: { [key: string]: string };
}

// Label preset type
interface LabelPreset {
  name: string;
  style: {
    color?: string;
    backgroundColor?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    [key: string]: string | undefined;
  };
}

// Enums
enum VfType {
  DATA = 'DATA',
  ACTION = 'ACTION',
  ICON = 'ICON',
  LABEL = 'LABEL'
}

enum ColumnType {
  DATA = 'DATA',
  SELECT = 'SELECT'
}
```