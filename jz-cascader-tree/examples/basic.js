/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import CascaderTree from '@alipay/jz-cascader-tree';

import { treeData } from './mock';

import 'antd/lib/style';
import 'antd/lib/checkbox/style';
import 'antd/lib/tag/style';
import 'antd/lib/button/style';
import styles from '../assets/index.less';

class Demo extends React.Component {
  state = {
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Cascader Demo</h2>
        <CascaderTree
          data={treeData}
          checkedKeys={[
            'value0', 
            'value1-1', 
            'value2-0',
          ]}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />, 
  document.getElementById('__react-content')
);
