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
import FlexiTable from './components/FlexiTable.vue'
import { VfField, VfType, LayoutTemplate, LabelPreset, Column, ColumnType } from './interfaces/table'

const keyStore = 'flexi-layout'
const cacheDefault = `${keyStore}.default`
const sortConfig = reactive<{ field?: string; direction?: 'asc' | 'desc' }>({})
const flexiTableRef = ref<InstanceType<typeof FlexiTable>>()

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

const vfFields: VfField[] = [
  {
    vfTitle: 'Mã SV',
    vfCode: 'id',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    vfActualFieldTitle: 'Mã SV',
  },
  {
    vfTitle: 'MSV: {{value}}',
    vfCode: 'id2',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    vfActualFieldTitle: 'Mã SV',
    templateShow: 'MSV: {{value}}',
  },
  {
    vfTitle: 'Func Show',
    vfCode: 'idFun',
    vfType: VfType.DATA,
    vfAcutalField: 'id',
    vfActualFieldTitle: 'Mã SV',
    templateShow: 'MSV: {{value}}',
    vfRenderFunc: (_row: any, _column: VfField, _index: number, _calFunc: string, value: any) => {
      const strong = document.createElement('strong')
      strong.style.color = '#F00'
      strong.textContent = value
      return `ID: ${strong.outerHTML}`
    },
  },
  {
    vfTitle: 'Họ Tên',
    vfCode: 'name',
    vfType: VfType.DATA,
    vfAcutalField: 'name',
    vfActualFieldTitle: 'Họ tên',
  },
  {
    vfTitle: 'Tuổi',
    vfCode: 'age',
    vfType: VfType.DATA,
    vfAcutalField: 'age',
    vfActualFieldTitle: 'Tuổi',
  },
  {
    vfTitle: 'Giới tính',
    vfCode: 'gender',
    vfType: VfType.DATA,
    vfAcutalField: 'gender',
    vfActualFieldTitle: 'Giới tính',
  },
  {
    vfTitle: 'Giới tính color',
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
  {
    vfTitle: 'Ngành học',
    vfCode: 'major',
    vfType: VfType.DATA,
    vfAcutalField: 'major',
    vfActualFieldTitle: 'Ngành học',
  },
  {
    vfTitle: 'Khóa học default',
    vfCode: 'courses',
    vfType: VfType.DATA,
    vfAcutalField: 'courses',
    vfActualFieldTitle: 'Khóa học',
  },
  {
    vfTitle: 'Khóa học dọc',
    vfCode: 'courses2',
    vfType: VfType.DATA,
    vfAcutalField: 'courses',
    vfActualFieldTitle: 'Khóa học',
    templateShow: '<div>{{$item}}</div>',
  },
  {
    vfTitle: 'Khóa học Func',
    vfCode: 'coursesFunc',
    vfType: VfType.DATA,
    vfAcutalField: 'courses',
    vfActualFieldTitle: 'Khóa học',
    vfRenderFunc: (row: any) => {
      return row.courses.join(' | ')
    },
  },
  {
    vfTitle: 'Điểm trung bình',
    vfCode: 'gpa',
    vfType: VfType.DATA,
    vfAcutalField: 'GPA',
    vfActualFieldTitle: 'Điểm trung bình',
  },
  {
    vfTitle: 'ĐTB: {{value}}',
    vfCode: 'gpa2',
    vfType: VfType.DATA,
    vfAcutalField: 'GPA',
    vfActualFieldTitle: 'Điểm trung bình',
    templateShow: 'ĐTB: {{value}}',
  },
  {
    vfTitle: 'Trạng thái',
    vfCode: 'status',
    vfType: VfType.DATA,
    vfAcutalField: 'status',
    enum: {
      dropout: 'Thôi học',
      studying: 'Đang học',
      graduate: 'Tốt nghiệp',
    },
    vfActualFieldTitle: 'Trạng thái',
  },
  {
    vfTitle: 'Tỉnh/TP',
    vfCode: 'provinceName',
    vfType: VfType.DATA,
    vfAcutalField: 'address.provinceName',
    vfActualFieldTitle: 'Tỉnh/TP',
  },
  {
    vfTitle: 'Quận/Huyện',
    vfCode: 'districtName',
    vfType: VfType.DATA,
    vfAcutalField: 'address.districtName',
    vfActualFieldTitle: 'Quận/Huyện',
  },
]

const actions: VfField[] = [
  {
    vfTitle: 'Xem',
    vfCode: 'detail',
    vfType: VfType.ACTION,
    // vfAcutalField: 'detail',
    // vfActualFieldTitle: "Xem",
  },
  {
    vfTitle: 'Sửa',
    vfCode: 'update',
    vfType: VfType.ACTION,
    // vfAcutalField: 'update',
    // vfActualFieldTitle: "Sửa",
  },
  {
    vfTitle: 'Xóa',
    vfCode: 'delete',
    vfType: VfType.ACTION,
    // vfAcutalField: 'delete',
    // vfActualFieldTitle: "Xóa",
  },
  {
    vfTitle: 'Detail name',
    vfCode: 'detail-name',
    vfType: VfType.ACTION,
    vfAcutalField: 'name',
    // vfActualFieldTitle: "Detail",
  },
  {
    vfTitle: 'Detail name func',
    vfCode: 'detail-name-func',
    vfType: VfType.ACTION,
    vfAcutalField: 'name',
    // vfActualFieldTitle: "Detail",
    vfRenderFunc: (row: any) => {
      return row.name
    },
  },
]

const icons: VfField[] = [
  {
    vfTitle: 'bookmark',
    vfCode: 'bookmark',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'bookmark',
    value: '/icons/bookmark.png',
  },
  {
    vfTitle: 'envelope',
    vfCode: 'envelope',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'envelope',
    value: '/icons/envelope.png',
  },
  {
    vfTitle: 'home',
    vfCode: 'home',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'home',
    value: '/icons/home.png',
  },
  {
    vfTitle: 'marker',
    vfCode: 'marker',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'marker',
    value: '/icons/marker.png',
  },
  {
    vfTitle: 'paper-plane',
    vfCode: 'paper-plane',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'paper-plane',
    value: '/icons/paper-plane.png',
  },
  {
    vfTitle: 'phone-call',
    vfCode: 'phone-call',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'phone-call',
    value: '/icons/phone-call.png',
  },
  {
    vfTitle: 'settings',
    vfCode: 'settings',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'settings',
    value: '/icons/settings.png',
  },
  {
    vfTitle: 'star',
    vfCode: 'star',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'star',
    value: '/icons/star.png',
  },
  {
    vfTitle: 'user',
    vfCode: 'user',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'user',
    value: '/icons/user.png',
  },
  {
    vfTitle: 'users-alt',
    vfCode: 'users-alt',
    vfType: VfType.ICON,
    // vfAcutalField: '',
    vfActualFieldTitle: 'users-alt',
    value: '/icons/users-alt.png',
  },
]

const data = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    age: 20,
    gender: 'Nam',
    major: 'Khoa học máy tính',
    GPA: 3.5,
    courses: ['Introduction to Programming', 'Data Structures', 'Algorithms'],
    status: 'dropout',
    address: {
      prorinceId: 1,
      provinceName: 'Hà Nội',
      districtId: 1,
      districtName: 'Hoàng Mai',
    },
  },
  {
    id: 2,
    name: 'Trần Thị B',
    age: 21,
    gender: 'Nữ',
    major: 'Kinh doanh',
    GPA: 3.2,
    courses: ['Marketing', 'Accounting', 'Business Communication'],
    status: 'studying',
    address: {
      prorinceId: 1,
      provinceName: 'Hà Nội',
      districtId: 2,
      districtName: 'Cầu Giấy',
    },
  },
  {
    id: 3,
    name: 'Lê Văn C',
    age: 19,
    gender: 'Nam',
    major: 'Kỹ thuật điện',
    GPA: 3.8,
    courses: ['Circuit Theory', 'Digital Electronics', 'Power Systems'],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    },
  },
  {
    id: 4,
    name: 'Lê Văn D',
    age: 19,
    gender: 'Nam',
    major: 'Kỹ thuật điện',
    GPA: 3.8,
    courses: ['Circuit Theory', 'Digital Electronics', 'Power Systems'],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    },
  },
  {
    id: 5,
    name: 'Lê Văn E',
    age: 19,
    gender: 'Nam',
    major: 'Kỹ thuật điện',
    GPA: 3.8,
    courses: ['Circuit Theory', 'Digital Electronics', 'Power Systems'],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    },
  },
]

const dataTable = computed(() => {
  return sortConfig.field && sortConfig.direction
    ? data.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof typeof a]
        const bValue = b[sortConfig.field as keyof typeof b]
        let result = 0
        switch (typeof aValue) {
          case 'number':
            result = aValue - (bValue as number)
            break
          case 'string':
            result = (aValue as string).localeCompare(bValue as string)
            break
          default:
            result = 0
        }

        return sortConfig.direction === 'asc' ? result : -result
      })
    : data
})

const defaultLayouts: LayoutTemplate[] = [
  {
    title: 'Mặc định',
    id: '11111111-1111-1111-1111-111111111111',
    isSystem: true,
    columns: [
      { title: 'Select', fieldCodes: [], isDrag: false, type: ColumnType.SELECT, align: 'center' },
      { title: 'Mã sinh viên', fieldCodes: ['idFun'], sortField: 'id', type: ColumnType.DATA },
      {
        title: 'Họ và tên',
        fieldCodes: ['detail-name-func'],
        type: ColumnType.DATA,
        sortField: 'name',
        isDrag: false,
      },
      { title: 'Ngành học', fieldCodes: ['major', 'newline', 'gpa2'], isDrag: false, type: ColumnType.DATA },
      { title: 'Khóa học', fieldCodes: ['courses2'], isDrag: false, type: ColumnType.DATA },
      { title: 'Địa chỉ', fieldCodes: ['districtName', 'space', 'minus', 'space', 'provinceName'], isDrag: false, type: ColumnType.DATA },
      { title: 'Giới tính', fieldCodes: ['gender2', 'newline', 'age'], isDrag: false, type: ColumnType.DATA },
      { title: 'Trạng thái', fieldCodes: ['star', 'space', 'status'], isDrag: false, type: ColumnType.DATA },
      {
        title: 'Actions',
        fieldCodes: [
          'detail',
          'space',
          'vertical',
          'space',
          'update',
          'space',
          'vertical',
          'space',
          'delete',
        ],
      },
    ],
  },
  {
    title: 'Default 2',
    id: '22222222-2222-2222-2222-222222222222',
    isSystem: true,
    columns: [
      { title: 'Mã sinh viên', fieldCodes: ['idFun'] },
      {
        title: 'Họ và tên',
        fieldCodes: ['name', 'space', 'minus', 'space', 'detail'],
      },
      { title: 'Ngành học', fieldCodes: ['major', 'newline', 'gpa2'] },
      { title: 'Khóa học', fieldCodes: ['courses2'] },
      {
        title: 'Địa chỉ',
        fieldCodes: ['districtName', 'space', 'minus', 'space', 'provinceName'],
      },
      { title: 'Giới tính', fieldCodes: ['gender2', 'newline', 'age'] },
      { title: 'Trạng thái', fieldCodes: ['star', 'space', 'status'] },
      { title: 'Text', fieldCodes: ['text-01'] },
    ],
    labels: [
      {
        code: 'text-01',
        title: 'Ví dụ:',
        style: {
          'font-size': '13px',
          color: 'red',
        },
      },
    ],
  },
]

const layoutId = ref(defaultLayouts[0].id)
const layouts = ref<LayoutTemplate[]>(defaultLayouts)

const onCta = (action: string, row: any, index: number) => {
  console.log(action, row, index)
}

const onErrorHandle = (msg: string) => {
  alert(msg)
}

const onSaveHandle = (layout: LayoutTemplate, cb: () => void) => {
  const saveId = layout.id
  const index = layouts.value.findIndex(layout => layout.id === saveId)
  layout.isSystem = false
  localStorage.setItem(`${keyStore}.${saveId}`, JSON.stringify(layout))
  if (index >= 0) {
    layouts.value[index] = layout
  } else {
    layouts.value.push(layout)
  }
  cb()
}

const onRemoveHandle = (id: string, cb: () => void) => {
  const index = layouts.value.findIndex(layout => layout.id === id)
  localStorage.removeItem(`${keyStore}.${id}`)
  layouts.value.splice(index, 1)
  cb()
}

const onSetDefaultHandle = (id: string, cb: () => void) => {
  localStorage.setItem(cacheDefault, id)
  layoutId.value = id
  cb()
}

const loadLayout = () => {
  const cacheLayouts: LayoutTemplate[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    if (key.indexOf(keyStore) >= 0) {
      const data = localStorage.getItem(key)
      if (key === cacheDefault) {
        layoutId.value = data || ''
      } else {
        cacheLayouts.push(JSON.parse(data || '{}'))
      }
    }
  }

  layouts.value.push(...cacheLayouts)
}

const onSelectChange = (selectedRows: number[]) => {
  console.log(selectedRows)
}

const onSortChange = ({ field, direction }: { field?: string; direction?: 'asc' | 'desc' }) => {
  sortConfig.field = field
  sortConfig.direction = direction
}

const getSelect = () => {
  console.log(flexiTableRef.value?.getSelect())
}
const setSelect = (indexes: number[]) => {
  flexiTableRef.value?.setSelect(indexes)
}
const clearSelect = () => {
  flexiTableRef.value?.clearSelect()
}
onMounted(() => {
  loadLayout()
})
</script>

<style lang="scss" scoped></style>
