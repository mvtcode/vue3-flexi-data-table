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

### FlexiTable

The main table component that displays data with configured columns.

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
      <!-- Custom actions slot -->
    </template>
  </FlexiTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FlexiTable, VfType } from 'vue3-flexi-data-table';

const flexiTableRef = ref();
const layoutId = ref('default');

// Define layouts
const layouts = ref([
  {
    id: 'default',
    name: 'Default Layout',
    isDefault: true,
    columns: [
      {
        title: 'ID',
        fieldCodes: ['id'],
        sortField: 'id'
      },
      {
        title: 'Name',
        fieldCodes: ['name'],
        sortField: 'name'
      },
      {
        title: 'Status',
        fieldCodes: ['status'],
        sortField: 'status'
      },
      {
        title: 'Actions',
        fieldCodes: ['view', 'edit', 'delete']
      }
    ]
  }
]);

// Define templates
const vfFields = ref([
  {
    vfCode: 'status',
    vfType: VfType.LABEL,
    vfTitle: 'Status',
    vfAcutalField: 'status'
  }
]);

// Define actions
const actions = ref([
  {
    vfCode: 'view',
    vfType: VfType.ACTION,
    vfTitle: 'View'
  },
  {
    vfCode: 'edit',
    vfType: VfType.ACTION,
    vfTitle: 'Edit'
  },
  {
    vfCode: 'delete',
    vfType: VfType.ACTION,
    vfTitle: 'Delete'
  }
]);

// Sample data
const dataTable = ref([
  {
    id: 1,
    name: 'John Doe',
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'inactive'
  }
]);

// Event handlers
const onCta = (action: string, row: any) => {
  console.log('Action clicked:', action, row);
};

const onErrorHandle = (error: Error) => {
  console.error('Error:', error);
};

const onSaveHandle = (layout: any) => {
  console.log('Layout saved:', layout);
};

const onRemoveHandle = (layoutId: string) => {
  console.log('Layout removed:', layoutId);
};

const onSetDefaultHandle = (layoutId: string) => {
  console.log('Set default layout:', layoutId);
};

const onSelectChange = (selectedRows: any[]) => {
  console.log('Selected rows:', selectedRows);
};

const onSortChange = (sort: { field: string; direction: string }) => {
  console.log('Sort changed:', sort);
};
</script>
```

## Props

### FlexiTable Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| modelValue | `string` | Yes | - | Layout ID (v-model) |
| layouts | `Layout[]` | Yes | - | Array of table layouts |
| templates | `VfField[]` | Yes | - | Field templates configuration |
| actions | `VfField[]` | No | `[]` | Action buttons configuration |
| icons | `VfField[]` | No | `[]` | Icon configuration |
| data | `any[]` | Yes | - | Table data |
| labelPresets | `LabelPreset[]` | No | `[]` | Predefined label styles |
| height | `number` | No | `400` | Table height in pixels |
| fixed | `boolean` | No | `false` | Enable fixed header |

### Layout Interface

```typescript
interface Layout {
  id: string;
  name: string;
  isDefault?: boolean;
  columns: Column[];
}
```

### Column Interface

```typescript
interface Column {
  title: string;
  fieldCodes: string[];
  sortField?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
}
```

### VfField Interface

```typescript
interface VfField {
  vfCode: string;
  vfType: VfType;
  vfTitle?: string;
  vfAcutalField?: string;
  vfRenderFunc?: (row: any, field: VfField, index: number) => string;
}
```

## Events

| Event | Parameters | Description |
|-------|------------|-------------|
| onCta | `(action: string, row: any)` | Triggered when an action button is clicked |
| error | `(error: Error)` | Triggered when an error occurs |
| save | `(layout: Layout)` | Triggered when a layout is saved |
| remove | `(layoutId: string)` | Triggered when a layout is removed |
| setDefault | `(layoutId: string)` | Triggered when a layout is set as default |
| selectChange | `(selectedRows: any[])` | Triggered when row selection changes |
| sortChange | `(sort: { field: string; direction: string })` | Triggered when sorting changes |

## Methods

You can access these methods using a template ref:

```typescript
const flexiTableRef = ref();

// Get selected rows
const selectedRows = flexiTableRef.value.getSelected();

// Set selected rows
flexiTableRef.value.setSelect([0, 1, 2]);

// Clear selection
flexiTableRef.value.clearSelect();

// Get current layout
const currentLayout = flexiTableRef.value.getCurrentLayout();

// Set layout
flexiTableRef.value.setLayout('layoutId');
```

## Styling

The component uses CSS variables for easy customization:

```css
:root {
  --vft-primary-color: #1890ff;
  --vft-border-color: #f0f0f0;
  --vft-header-bg: #fafafa;
  --vft-row-hover-bg: #f5f5f5;
  --vft-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Support

If you have any questions or need help, please:

1. Check the documentation
2. Open an issue on GitHub
3. Contact the author