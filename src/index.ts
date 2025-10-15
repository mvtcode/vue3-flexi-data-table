import DynamicTable from "@/components/DynamicTable.vue";
import TableEditor from "./components/TableEditor.vue";
import FlexiTable from "./components/FlexiTable.vue";
import { VfField, Column, LabelField, LayoutTemplate, VariantsField, LabelPreset, LabelStyle, SortConfig } from "./interfaces/table";
import { VField } from "./interfaces/vfield";
import { VfType, ColumnType } from "./enums/table.enum";

export type { VfField, Column, LayoutTemplate, LabelField, VariantsField, LabelPreset, LabelStyle, SortConfig, VField };
export { DynamicTable, TableEditor, FlexiTable, VfType, ColumnType };
