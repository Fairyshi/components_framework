/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React, { Component } from '@alipay/bigfish/react';
import { connect } from '@alipay/bigfish/sdk';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Card from '@/layout/ContentCard';

import PageHeaderWrapper from '@/component/PageHeaderWrapper';

import { Icon, Form, Row, Col, Button, Empty } from 'antd';

import { 
  getItemLabel,
  getValidate,
  replaceEmptyStr2Null, 
  isExisted
} from '@/util/index';

import { FormError } from '@/component/validatorDp';

import styles from './index.less';

const FormItem = Form.Item;

export default
@connect(({ appFoo = {} }) => {
  const {
    readOnly,
    formInfo,
    errorInfo,
    asyncForm,
    isShowSubmitFeedback,
  } = appFoo;

  const id = _.get(formInfo, 'id');

  return {
    formInfo,
    errorInfo: replaceEmptyStr2Null(errorInfo),
    readOnly: readOnly && isExisted(id),
    // 编辑状态下原表单值
    asyncForm,
    isShowSubmitFeedback,
  };
})
class AppFoo extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    dispatch: PropTypes.func,
    location: PropTypes.shape({
      path: PropTypes.string,
      hash: PropTypes.string,
    }),
    formInfo: PropTypes.shape({
    }),
    errorInfo: PropTypes.shape({
    }),
    updateFormInfo: PropTypes.func,
    clearError: PropTypes.func,
  };

  static defaultProps = {
    readOnly: false,
    dispatch: null,
    location: {},
    formInfo: {},
    errorInfo: {},
    updateFormInfo: null,
    clearError: null,
  };

  componentDidMount() {
    this.notify('appFoo/init');
  }

  componentWillUnmount() {
    this.notify('appFoo/reset');
  }

  notify = (type, payload) => {
    const { dispatch } = this.props;
    dispatch(payload ? { type, payload } : { type });
  };

  notifyChange = key => value => {
    const payload = { [key]: value };

    this.notify('appFoo/updateFormInfo', payload);
    this.clearError(value, key);
  };

  clearError = (currentValue, keyPathInErrorInfo) => {
    const { errorInfo } = this.props;
    const currentError = _.get(errorInfo, keyPathInErrorInfo);

    if (currentValue && currentError) {
      const payload = { [keyPathInErrorInfo]: '' };
      this.notify('appFoo/clearError', payload);
    }
  };

  save = () => {
    this.notify('appFoo/save');
  };

  cancel = () => {
    this.notify('appFoo/cancel');
  };

  renderUnit = () => {
    const { formInfo, errorInfo, readOnly } = this.props;

    return (
      <div className={styles.tableunit}>
      </div>
    );
  };

  render() {
    const { readOnly, errorInfo, isShowSubmitFeedback, location } = this.props;
    const jsxOper = readOnly ? null : (
      <Row>
        <Col offset={4} span={9} style=>
          <div className={styles.center}>
            <Button type="primary" onClick={this.save}>
              保存并返回
            </Button>
            <Button style= onClick={this.cancel}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );

    const props = isShowSubmitFeedback
      ? { location, showSubmitFeedback: '列表。。。' }
      : { location };

    return (
      <PageHeaderWrapper title={null}>
        <Card>
          <div>
            <Empty />
            {jsxOper}
            <FormError
              /* showErrorKey={true} */
              errors={errorInfo}
              onDelete={path => this.clearError(undefined, path, true)}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
