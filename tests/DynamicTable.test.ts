import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DynamicTable from '../src/components/DynamicTable.vue';
import { ColumnType } from '../src/interfaces/table';
import { ref } from 'vue';

describe('DynamicTable.vue', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Wilson', age: 35 }
  ];

  const mockColumns = [
    {
      title: 'Name',
      fieldCodes: ['name'],
      sortField: 'name'
    },
    {
      title: 'Age',
      fieldCodes: ['age'],
      sortField: 'age',
      align: 'right'
    }
  ];

  let wrapper;

  beforeEach(() => {
    wrapper = mount(DynamicTable, {
      props: {
        columns: mockColumns,
        data: mockData,
        templates: [],
        labels: [],
        fixed: false
      }
    });
  });

  // Test rendering
  it('renders all data rows', () => {
    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(mockData.length);
  });

  it('renders all columns', () => {
    const headers = wrapper.findAll('th');
    expect(headers).toHaveLength(mockColumns.length);
  });

  // Test sorting
  it('emits sortChange event when clicking sortable column header', async () => {
    const firstHeader = wrapper.findAll('th').at(0);
    await firstHeader.trigger('click');

    expect(wrapper.emitted('sortChange')).toBeTruthy();
    expect(wrapper.emitted('sortChange')[0][0]).toEqual({
      field: 'name',
      direction: 'asc'
    });
  });

  it('cycles through sort states on multiple clicks', async () => {
    const firstHeader = wrapper.findAll('th').at(0);

    // First click - asc
    await firstHeader.trigger('click');
    expect(wrapper.emitted('sortChange')[0][0].direction).toBe('asc');

    // Second click - desc
    await firstHeader.trigger('click');
    expect(wrapper.emitted('sortChange')[1][0].direction).toBe('desc');

    // Third click - no sort
    await firstHeader.trigger('click');
    expect(wrapper.emitted('sortChange')[2][0].direction).toBeUndefined();
  });

  // Test selection
  it('handles row selection with SELECT column', async () => {
    const selectColumns = [
      {
        type: ColumnType.SELECT,
        fieldCodes: [],
        width: '40px'
      },
      ...mockColumns
    ];

    const selectWrapper = mount(DynamicTable, {
      props: {
        columns: selectColumns,
        data: mockData,
        templates: [],
        labels: [],
        fixed: false
      }
    });

    // Test select single row
    const firstCheckbox = selectWrapper.findAll('input[type="checkbox"]').at(1);
    await firstCheckbox.setValue(true);
    expect(selectWrapper.emitted('selectChange')[0][0]).toEqual([0]);

    // Test select all
    const selectAllCheckbox = selectWrapper.findAll('input[type="checkbox"]').at(0);
    await selectAllCheckbox.setValue(true);
    expect(selectWrapper.emitted('selectChange')[1][0]).toEqual([0, 1, 2]);
  });

  // Test exposed methods
  it('exposes selection methods', () => {
    expect(wrapper.vm.getSelect).toBeDefined();
    expect(wrapper.vm.setSelect).toBeDefined();
    expect(wrapper.vm.clearSelect).toBeDefined();
  });

  it('setSelect method updates selection', async () => {
    await wrapper.vm.setSelect([0, 1]);
    expect(wrapper.emitted('selectChange')[0][0]).toEqual([0, 1]);
  });

  it('clearSelect method clears selection', async () => {
    await wrapper.vm.setSelect([0, 1]);
    await wrapper.vm.clearSelect();
    expect(wrapper.emitted('selectChange')[1][0]).toEqual([]);
  });

  // Test styling
  it('applies column alignment', () => {
    const secondColumn = wrapper.findAll('td').at(1);
    expect(secondColumn.attributes('style')).toContain('text-align: right');
  });

  it('applies fixed height when specified', async () => {
    await wrapper.setProps({ height: 400, fixed: true });
    expect(wrapper.find('.wrapper-table').attributes('style')).toContain('height: 400px');
  });
}); 