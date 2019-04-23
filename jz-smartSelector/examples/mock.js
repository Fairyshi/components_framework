import React from 'react';

export const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

export const tableData = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park',
}];

export const treeData = [
  {
    label: 'label0',
    value: 'value0',
  },
  {
    label: 'label1',
    value: 'value1',
    children: [
        {
            label: 'label1-0',
            value: 'value1-0',            
        },
        {
            label: 'label1-1',
            value: 'value1-1',
            children: [
                {
                    label: 'label1-1-0',
                    value: 'value1-1-0',            
                },
                {
                    label: 'label1-1-1',
                    value: 'value1-1-1',            
                },
                {
                    label: 'label1-1-2',
                    value: 'value1-1-2',            
                },
                {
                    label: 'label1-1-3',
                    value: 'value1-1-3',            
                },
                {
                    label: 'label1-1-4',
                    value: 'value1-1-4',            
                },
                {
                    label: 'label1-1-5',
                    value: 'value1-1-5',            
                },
                {
                    label: 'label1-1-6',
                    value: 'value1-1-6',            
                },
                {
                    label: 'label1-1-7',
                    value: 'value1-1-7',            
                },
                {
                    label: 'label1-1-8',
                    value: 'value1-1-8',            
                },
                {
                    label: 'label1-1-9',
                    value: 'value1-1-9',            
                },
                {
                    label: 'label1-1-10',
                    value: 'value1-1-10',            
                },
                {
                    label: 'label1-1-11',
                    value: 'value1-1-11',            
                },
                {
                    label: 'label1-1-12',
                    value: 'value1-1-12',            
                },
                {
                    label: 'label1-1-13',
                    value: 'value1-1-13',            
                },
                {
                    label: 'label1-1-14',
                    value: 'value1-1-14',            
                },
                {
                    label: 'label1-1-15',
                    value: 'value1-1-15',            
                },
            ],       
        },
    ],
  },
  {
    label: 'label2',
    value: 'value2',
    children: [
        {
            label: 'label2-0',
            value: 'value2-0',            
        },
        {
            label: 'label2-1',
            value: 'value2-1',    
            children: [
                {
                    label: 'label2-1-0',
                    value: 'value2-1-0',            
                },
                {
                    label: 'label2-1-1',
                    value: 'value2-1-1',            
                },
                {
                    label: 'label2-1-2',
                    value: 'value2-1-2',            
                },
                {
                    label: 'label2-1-3',
                    value: 'value2-1-3',            
                },
                {
                    label: 'label2-1-4',
                    value: 'value2-1-4',            
                },
                {
                    label: 'label2-1-5',
                    value: 'value2-1-5',            
                },
                {
                    label: 'label2-1-6',
                    value: 'value2-1-6',            
                },
                {
                    label: 'label2-1-7',
                    value: 'value2-1-7',            
                },
                {
                    label: 'label2-1-8',
                    value: 'value2-1-8',            
                },
                {
                    label: 'label2-1-9',
                    value: 'value2-1-9',            
                },
                {
                    label: 'label2-1-10',
                    value: 'value2-1-10',            
                },
                {
                    label: 'label2-1-11',
                    value: 'value2-1-11',            
                },
                {
                    label: 'label2-1-12',
                    value: 'value2-1-12',            
                },
                {
                    label: 'label2-1-13',
                    value: 'value2-1-13',            
                },
                {
                    label: 'label2-1-14',
                    value: 'value2-1-14',            
                },
                {
                    label: 'label2-1-15',
                    value: 'value2-1-15',            
                },                
            ],          
        },
    ],
  },
];