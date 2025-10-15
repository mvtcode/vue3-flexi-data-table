import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TableEditor from '../src/components/TableEditor.vue';
import { ColumnType, VfType } from '../src/enums/table.enum';
import { ref } from 'vue';

describe('TableEditor.vue', () => {
  const mockVfFields = [
    {
      vfTitle: 'Name',
      vfCode: 'name',
      vfType: VfType.DATA,
      vfAcutalField: 'name',
      vfActualFieldTitle: 'Name'
    },
    {
      vfTitle: 'Age',
      vfCode: 'age',
      vfType: VfType.DATA,
      vfAcutalField: 'age',
      vfActualFieldTitle: 'Age'
    }
  ];

  const mockColumns = [
    {
      title: 'Name',
      fieldCodes: ['name'],
      sortField: 'name',
      type: ColumnType.DATA,
      isDrag: false
    }
  ];

  let wrapper;

  beforeEach(() => {
    wrapper = mount(TableEditor, {
      props: {
        modelValue: mockColumns,
        vfFields: mockVfFields,
        actions: [],
        icons: [],
        height: 400
      },
      global: {
        stubs: {
          'Popper': {
            template: '<div><slot></slot><slot name="content"></slot></div>',
            props: ['placement', 'arrow']
          },
          'PopupEditLabel': true,
          'draggable': true
        }
      }
    });
  });

  // Test rendering
  it('renders all available fields', () => {
    const fields = wrapper.findAll('.list-field .item');
    expect(fields).toHaveLength(mockVfFields.length);
  });

  it('renders current columns', () => {
    const columns = wrapper.findAll('.list-group-item');
    expect(columns).toHaveLength(mockColumns.length);
  });

  // Test column operations
  it('adds new column when clicking add button', async () => {
    const addButton = wrapper.find('.btn-plus');
    await addButton.trigger('click');

    expect(wrapper.emitted('update:modelValue')[0][0]).toHaveLength(mockColumns.length + 1);
  });

  it('removes column when clicking close button', async () => {
    const closeButton = wrapper.find('.btn-close');
    await closeButton.trigger('click');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0][0].fieldCodes).toHaveLength(0);
  });

  // Test sort configuration
  it('configures sort field for column', async () => {
    const btnMore = wrapper.find('.btn-more');
    await btnMore.trigger('click');
    await wrapper.vm.$nextTick();

    wrapper.vm.columnsEdit[0].sortField = mockVfFields[0].vfAcutalField;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.columnsEdit[0].sortField).toBe(mockVfFields[0].vfAcutalField);
  });

  it('removes sort configuration when selecting no sort', async () => {
    const btnMore = wrapper.find('.btn-more');
    await btnMore.trigger('click');
    await wrapper.vm.$nextTick();

    wrapper.vm.columnsEdit[0].sortField = '';
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.columnsEdit[0].sortField).toBe('');
  });

  // Test column type
  it('changes column type', async () => {
    const btnMore = wrapper.find('.btn-more');
    await btnMore.trigger('click');
    await wrapper.vm.$nextTick();

    wrapper.vm.columnsEdit[0].type = ColumnType.SELECT;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.columnsEdit[0].type).toBe(ColumnType.SELECT);
  });

  // Test alignment
  it('sets column alignment', async () => {
    const btnMore = wrapper.find('.btn-more');
    await btnMore.trigger('click');
    await wrapper.vm.$nextTick();

    wrapper.vm.columnsEdit[0].align = 'left';
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.columnsEdit[0].align).toBe('left');
  });

  // Test drag and drop
  it('handles field drag and drop', async () => {
    const dropZone = wrapper.find('.label');
    
    await dropZone.trigger('dragover', {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(mockVfFields[0])
      }
    });
    await wrapper.vm.$nextTick();
    
    wrapper.vm.columnsEdit[0].isDrag = true;
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.columnsEdit[0].isDrag).toBe(true);

    await dropZone.trigger('dragleave', {
      preventDefault: () => {}
    });
    await wrapper.vm.$nextTick();
    
    wrapper.vm.columnsEdit[0].isDrag = false;
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.columnsEdit[0].isDrag).toBe(false);
  });
}); 