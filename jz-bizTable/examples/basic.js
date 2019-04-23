/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import BizTable from '@alipay/jz-bizTable';

import { bizTableData } from './mock';

import 'antd/lib/style';
import 'antd/lib/table/style';
import 'antd/lib/icon/style';
import styles from '../assets/index.less';

/* column._config: { 
  ellipsis,
  multiEllipsis,      --> ok
  prefix,             --> ok
  prefixColor,        --> ok
  suffix,             --> ok
  clipboard,          --> ok
  format percentage,  --> ok
  format float,       --> ok
  format integer,     --> ok
  format date,        --> ok
  format time,     --> ok
  href,               --> ok
  textRight,          --> ok
} */

export const columns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
  _config: {
    prefix: <Icon type="bar-chart" />,
    suffix: <Icon type="setting" />,
  }
}, {
  title: '分数',
  dataIndex: 'score',
  key: 'score',
  _config: {
    clipboard: true,
    format: 'float',
    suffix: <Icon type="question-circle" />,
  }
}, {
  title: '百分比',
  dataIndex: 'percent',
  key: 'percent',
  _config: {
    format: 'percentage',
    textRight: true,
  }
}, {
  title: '住址',
  dataIndex: 'address',
  key: 'address',
  _config: {
    prefixColor: 'green',
    href: 'www.taobao.com',
    /* multiEllipsis: 2, */
    ellipsis: true,
  }
}, {
  title: '日期',
  dataIndex: 'createTime',
  key: 'createTimeDate',
  _config: {
    format: 'date',
  }
}, {
  title: '时间',
  dataIndex: 'createTime',
  key: 'createTimeTime',
  _config: {
    format: 'time',
  }
}];

class Demo extends React.Component {
  state = {
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>BizTable Demo</h2>
        <BizTable
          dataSource={bizTableData}
          columns={columns}
          config={{
            namespace: 'helloworld',
            dispatch: () => {},
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />, 
  document.getElementById('__react-content')
);
