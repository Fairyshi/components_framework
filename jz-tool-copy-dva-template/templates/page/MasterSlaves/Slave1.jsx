/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React, { Component } from '@alipay/bigfish/react';
import { connect } from '@alipay/bigfish/sdk';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Form, Row, Col, Button, Empty } from 'antd';

import Card from '@/layout/ContentCard';
import PageHeaderWrapper from '@/component/PageHeaderWrapper';
import { FormError } from '@/component/validatorDp';

import { MAX_INPUT_LENGTH } from '@/constant/index';
import { 
  getItemLabel,
  getValidate,
  replaceEmptyStr2Null, 
  isExisted
} from '@/util/index';

import styles from './index.less';

const FormItem = Form.Item;

export default
@connect(({ {{appNamespace}} = {} }) => {
  const {
    readOnly,
    formInfo,
    errorInfo,
    isShowSubmitFeedback,
  } = {{appNamespace}};

  const id = _.get(formInfo, 'id');

  return {
    formInfo,
    errorInfo: replaceEmptyStr2Null(errorInfo),
    readOnly: readOnly && isExisted(id),
    isShowSubmitFeedback,
  };
})
class {{ContainerName}} extends Component {
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
    this.notify('init');
  }

  componentWillUnmount() {
    this.notify('reset');
  }

  notify = (type_, payload) => {
    const { dispatch } = this.props;
    const type = `{{appNamespace}}/${type_}`;

    dispatch(
      payload 
        ? { type, payload } 
        : { type }
    );
  };

  notifyChange = key => value => {
    const payload = { [key]: value };

    this.notify('updateFormInfo', payload);
    this.clearError(value, key);
  };

  clearError = (currentValue, keyPathInErrorInfo) => {
    const { errorInfo } = this.props;
    const currentError = _.get(errorInfo, keyPathInErrorInfo);

    if (currentValue && currentError) {
      const payload = { [keyPathInErrorInfo]: '' };
      this.notify('clearError', payload);
    }
  };

  save = () => {
    this.notify('save');
  };

  cancel = () => {
    this.notify('cancel');
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
        <Col offset={4} span={9} style={{ paddingLeft: 16 }}>
          <div className={styles.center}>
            <Button type="primary" onClick={this.save}>
              保存并返回
            </Button>
            <Button style={{ marginLeft: 24, marginTop: 24 }} onClick={this.cancel}>
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
