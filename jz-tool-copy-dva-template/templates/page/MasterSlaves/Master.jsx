import React, { Component } from '@alipay/bigfish/react';
import { connect } from '@alipay/bigfish/sdk';
import { Layout, BackTop, Alert, Empty } from 'antd';

import {  } from '@/util';

import Slave1 from './Slave1';
import Slave2 from './Slave2';

import styles from './index.less';

const { Sider, Content } = Layout;

export default
@connect(({ {{appNamespace}}, loading, user }) => ({
  {{appNamespace}},
  loading,
  user,
}))
class {{ContainerName}} extends Component {
  switchPageType = item => {
    const { dispatch } = this.props;
    const pageType = item.key;
    
    dispatch({
      type: '{{appNamespace}}/updateFormInfo',
      payload: { pageType }
    });
  };

  // 'slave1' | 'slave2'
  renderContent() {
    const { {{appNamespace}} = {} } = this.props;
    const { pageType } = {{appNamespace}};

    let rez = null;
    switch(pageType) {
      case 'basicInfo': 
        rez = <Slave1 />; 
        break;
      case 'slave2': 
        rez = <Slave2 />; 
        break;
      default: 
        rez = <Slave1 />;
    }

    return rez;
  }

  render() {
    const { {{appNamespace}}, user, qualificationCategoryInfo } = this.props;

    return (
      <div className={styles.qualificationContentWrap}>
        {this.renderTopAlert()}
        <Layout>
          <Sider theme="light" width={160}>
            <Empty />
          </Sider>
          <Content>
            {this.renderContent()}
            <BackTop visibilityHeight={10} />
          </Content>
        </Layout>
      </div>
    );
  }
}
