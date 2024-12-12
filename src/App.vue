<template>
  <DynamicTable fixed :height="250" :columns="columnsEdit" :templates="[...vfFields, ...icons, ...actions]" :data="data" @onCta="onCta" />

  <hr style="margin: 20px 0 0"/>

  <div class="grid">
    <div class="grid-item">
      <h4>Build columns</h4>
      <TableEditor v-model="columnsEdit" :vfFields="vfFields" :actions="actions" :icons="icons" />
    </div>
    <div class="grid-item">
      <h4>Template columns</h4>
      <textarea v-model="vfFieldsEdit" class="custom-scroll" />
    </div>
    <div class="grid-item">
      <h4>Table data</h4>
        <textarea v-model="dataEdit" class="custom-scroll" />
    </div>
  </div>

  <div class="grid-2-col">
    <div class="grid-item">
      <h4 style="margin-bottom: 10px;">Columns</h4>
      <div class="box column-out custom-scroll">
        {{ columnShow }}
      </div>
    </div>
    <div class="grid-item">
      <h4 style="margin-bottom: 10px;">Actions log</h4>
      <div class="box column-out custom-scroll">
        <pre>{{ actionSelects.join('\n') }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DynamicTable from './components/DynamicTable.vue';
import TableEditor from './components/TableEditor.vue';
import { VfField, VfType, Column } from './interfaces/table';

const vfFields = ref<VfField[]> ([
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
    vfRenderFunc: (row: any) => {
      return `ID: <strong style="color: #F00">${row.id}</strong>`;
    }
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
      return `<span style="color: ${row.gender === 'Nam' ? 'red' : 'blue'}">${row.gender}</span>`;
    }
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
      return row.courses.join(' | ');
    }
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
      graduate: 'Tốt nghiệp'
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
]);

const actions: VfField[] = [
  {
    vfTitle: 'Xem',
    vfCode: 'detail',
    vfType: VfType.ACTION,
    // vfAcutalField: 'detail',
    vfActualFieldTitle: 'Xem',
  },
  {
    vfTitle: 'Sửa',
    vfCode: 'update',
    vfType: VfType.ACTION,
    // vfAcutalField: 'update',
    vfActualFieldTitle: 'Sửa',
  },
  {
    vfTitle: 'Xóa',
    vfCode: 'delete',
    vfType: VfType.ACTION,
    // vfAcutalField: 'delete',
    vfActualFieldTitle: 'Xóa',
  },
  {
    vfTitle: 'Đổi giới tính',
    vfCode: 'chagnegender',
    vfType: VfType.ACTION,
    // vfAcutalField: 'chagnegender',
    vfActualFieldTitle: 'Đổi giới tính',
  },
];

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
];

const vfFieldsEdit = computed({
  get(): string {
    return JSON.stringify(vfFields.value, null, 2);
  },
  set(value: string) {
    vfFields.value = JSON.parse(value);
  }
});

const data = ref([
  {
    id: 1,
    name: "Nguyễn Văn A",
    age: 20,
    gender: "Nam",
    major: "Khoa học máy tính",
    GPA: 3.5,
    courses: ["Introduction to Programming", "Data Structures", "Algorithms"],
    status: 'dropout',
    address: {
      prorinceId: 1,
      provinceName: 'Hà Nội',
      districtId: 1,
      districtName: 'Hoàng Mai',
    }
  },
  {
    id: 2,
    name: "Trần Thị B",
    age: 21,
    gender: "Nữ",
    major: "Kinh doanh",
    GPA: 3.2,
    courses: ["Marketing", "Accounting", "Business Communication"],
    status: 'studying',
    address: {
      prorinceId: 1,
      provinceName: 'Hà Nội',
      districtId: 2,
      districtName: 'Cầu Giấy',
    }
  },
  {
    id: 3,
    name: "Lê Văn C",
    age: 19,
    gender: "Nam",
    major: "Kỹ thuật điện",
    GPA: 3.8,
    courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    }
  },
  {
    id: 4,
    name: "Lê Văn D",
    age: 19,
    gender: "Nam",
    major: "Kỹ thuật điện",
    GPA: 3.8,
    courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    }
  },
  {
    id: 5,
    name: "Lê Văn E",
    age: 19,
    gender: "Nam",
    major: "Kỹ thuật điện",
    GPA: 3.8,
    courses: ["Circuit Theory", "Digital Electronics", "Power Systems"],
    status: 'graduate',
    address: {
      prorinceId: 2,
      provinceName: 'HCM',
      districtId: 1,
      districtName: 'Quận 1',
    }
  }
]);

const dataEdit = computed({
  get(): string {
    return JSON.stringify(data.value, null, 2);
  },
  set(value) {
    data.value = (value && JSON.parse(value)) || [];
  }
});

const columns: Column[] = [ { "title": "Mã sinh viên", "fieldCodes": [ "idFun" ] }, { "title": "Họ và tên", "fieldCodes": [ "name", "space", "minus", "space", "detail" ] }, { "title": "Ngành học", "fieldCodes": [ "major", "newline", "gpa2" ] }, { "title": "Khóa học", "fieldCodes": [ "courses2" ] }, { "title": "Địa chỉ", "fieldCodes": [ "districtName", "space", "minus", "space", "provinceName" ] }, { "title": "Giới tính", "fieldCodes": [ "gender2", "newline", "age" ] }, { "title": "Trạng thái", "fieldCodes": [ "star", "space", "status" ] }, { "title": "Actions", "fieldCodes": [ "detail", "space", "vertical", "space", "update", "space", "vertical", "space", "delete", "newline", "chagnegender" ] } ];

const columnsEdit = ref<Column[]>(
  columns.map(column => {
    return {
      ...column,
      isDrag: false,
    }
  })
);

const columnShow = computed (() => {
  return columnsEdit.value.map(column => {
    const { isDrag, ...columnInfo } = column;
    return  columnInfo;
  });
});

const actionSelects = ref<string[]>([]);
const onCta = (action: string, row: any, index: number) => {
  actionSelects.value.push(`Event: ${action} | index: ${index} | id: ${row.id}`);
}
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

.grid {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr;

  h4 {
    margin-bottom: 10px;
  }
  
  .grid-item + .grid-item {
    margin-left: 10px;
  }
}

.grid-2-col {
  display: grid;
  grid-template-columns: 4fr 1fr;

  h4 {
    margin-bottom: 10px;
  }
  
  .grid-item {
    .column-out {
      overflow-y: auto;
    }
  }

  .grid-item + .grid-item {
    margin-left: 10px;
  }
}

textarea {
  resize: none;
  width: calc(100% - 10px);
  height: 400px;
  outline-color: #DDD;
  border: 1px solid #DDD;
  border-radius: 5px;
  padding: 5px;
}

.box {
  &.column-out {
    height: 100px;
    padding: 10px;
  }
}
</style>
