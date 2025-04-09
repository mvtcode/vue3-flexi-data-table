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

## License

MIT