/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd';

import Table, { 
  PreviewList, 
  SmartProvider, 
  SelectedConsumer, 
  SelectedConsumerGroup, 
  SelectedConsumerSelect, 
  TriggerAll,
  StoreBasic,
} from '@alipay/jz-SmartSelector';

import { tableData, columns } from './mock';

import 'antd/lib/style';
import 'antd/lib/checkbox/style';
import 'antd/lib/tag/style';
import 'antd/lib/button/style';
import 'antd/lib/table/style';
import 'antd/lib/select/style';

import styles from '../assets/index.less';

const store = new StoreBasic('key');

class Demo extends React.Component {
  state = {
  }

  render() {
    // rowSelection object indicates the need for row selection
    const onGetValue = (value, event) => {
      console.log('---call batch submit, seleted item info:---');
      console.log(value, event);
      alert(`
当前的用户选项是: ${JSON.stringify(value)}；
全量信息是: 
    ${JSON.stringify(event)}
      `);
    };

    const onNotGetValue = (value, event) => {
      console.log('---call batch edit, seleted item info:---');
      console.log(value, event);
    };

    return (
      <div style={{ margin: 20 }}>
        <h2>SmartSelector Demo</h2>
        <p>
          <h3>Demo TriggerAll: </h3>
          <TriggerAll store={store} />
        </p>
        <p>
          <h3>Demo SelectedConsumerGroup: </h3>
          <SelectedConsumerGroup store={store}>
            <Button type="primary" onClick={onGetValue} style={{marginRight: '8px'}}>批量启用</Button>
            <Button type="primary" onClick={onGetValue} style={{marginRight: '8px'}}>批量编辑</Button>
            <Button type="primary" onClick={onNotGetValue}>批量删除</Button>
          </SelectedConsumerGroup>
        </p>
        <p>
          <h3>Demo SelectedConsumerSelect: </h3>
          <SelectedConsumerSelect 
            store={store} 
            data={[
              {label: '批量启用', value: 'enable'},
              {label: '批量编辑', value: 'edit'},
              {label: '批量删除', value: 'delete'},
            ]}
          />
        </p>
        <p>
          <h3>Demo SelectedConsumer: </h3>
          <SelectedConsumer store={store} emptyContent={<a>无选项时,自定义「批量提交」UI</a>}>
            <Button type="primary" onClick={onGetValue}>批量提交</Button>
          </SelectedConsumer>
          <SelectedConsumer store={store}>
            <Button type="primary" onClick={onNotGetValue} style={{marginLeft: '8px'}}>批量编辑</Button>
          </SelectedConsumer>
        </p>
        <Table
          store={store}
          rowSelection={true}
          columns={columns}
          dataSource={tableData} 
        />
        {/* <SmartSelector
          data={treeData}
          checkedKeys={[
            'value0', 
            'value1-1', 
            'value2-0',
          ]}
        /> */}
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />, 
  document.getElementById('__react-content')
);
