/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Collapse from '@alipay/jz-collapse';
import { Button, Input } from 'antd';

import 'antd/lib/style';
import 'antd/lib/button/style';
import 'antd/lib/input/style';
import styles from '../assets/index.less';

const colProps = {
  style:  { marginRight: 8, marginBottom: 8 },
  type: "primary"
};
const iptStl = { width: 238, marginRight: 8 };

class Demo extends React.Component {
  render() {
    const items = [];
    [...Array(20)].forEach((item, index) => {
      items[index] = index % 2 
      ? <Input placeholder={`Search Keyword ${index}...`}  style={iptStl} />
      : <Button {...colProps}>-------Hello, This is Col-{index}------</Button>
    });

    return (
      <div style={{ margin: 20 }}>
        <h2>Collapse Demo</h2>
        <Collapse openKeys={[0, 1, 4, 7, 8]}>
        {items}
        </Collapse>
      </div>
    );
  }
}

ReactDOM.render(
  <Demo />, 
  document.getElementById('__react-content')
);
