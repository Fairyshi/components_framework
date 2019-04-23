/*
 * @Author: 嘉竹 (shifei.sf)
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table, Button, Row, Col, Select, Icon, Menu, Dropdown } from 'antd';
import { Link } from 'dva/router';

import {MAX_INPUT_LENGTH } from '@/constant/index';
import PageHeaderWrapper from '@/component/PageHeaderWrapper';
import Card from '@/layout/ContentCard';

import FlexJustify from '@/component/layout/FlexJustify';
import OnelinePopover from '@/component/popover';
import ClipBoard from '@/component/ClipBoard';
import ColorIndicator from '@/component/colorIndicator';
import Search from '@/component/input';
import {
  getPath,
  getUrlWithSearch,
} from '@/util/index';

const { Option } = Select;

export default
@connect(({ {{appNamespace}}, loading = {}, user = {}, global = {} }) => {
  const { keyword, status, list, pager } = {{appNamespace}};
  return {
    keyword,
    status: status === '' ? undefined : status,
    list,
    pager,
    loading: loading.effects['{{appNamespace}}/{{getList}}'],
    user,
    globalRoutes: global.globalRoutes,
  };
})
class {{ContainerName}} extends Component {
  static propTypes = {};

  static defaultProps = {};

  componentWillUnmount() {
    this.notify('{{appNamespace}}/reset');
  }

  notify = (type, payload) => {
    const { dispatch } = this.props;
    dispatch(payload ? { type, payload } : { type });
  };

  update = (payload = {}) => {
    this.notify('{{appNamespace}}/{{getList}}', payload);
  };

  onChange = e => {
    this.notify('{{appNamespace}}/updateFormInfo', { keyword: e.target.value });
  };

  onBlur = value => {
    if (typeof value === 'string') {
      this.update();
    }
  };

  onSelect = status_ => {
    this.update({ status: status_ });
  };

  onConfirm = id => {
    this.notify('{{appNamespace}}/delete', id);
  };

  onSwitch = item => {
    this.notify('{{appNamespace}}/enableCampaign', item.id);
  };

  onChangePager = (page, pageSize) => {
    const { pager = {} } = this.props;
    const newPager = { ...pager, current: page };
    this.update({ pager: newPager });
  };

  render() {
    const { keyword, status, list, pager = {}, loading, user, globalRoutes = {} } = this.props;

    const createUrl = getPath(globalRoutes, 'todo');

    const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      }];

    const pagination = { ...pager, onChange: this.onChangePager };
    return (
      <PageHeaderWrapper title={null}>
        <Card>
          <div>
            <Row>
              <FlexJustify>
                <Col span={6}>
                  <Select
                    {...getSelectProps({
                      placeholder: '所有状态',
                      value: status,
                      onChange: this.onSelect,
                    })}
                  >
                    {[].map((item, index) => (
                      <Option key={`status-${index}`} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Search
                    value={keyword}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    style={{ width: '90%' }}
                    placeholder="请输入"
                    maxLength={MAX_INPUT_LENGTH}
                  />
                </Col>
                <Button type="primary">
                  <Link to={createUrl}>新建</Link>
                </Button>
              </FlexJustify>
            </Row>
            <div className="">
              <Table
                rowKey="id"
                loading={loading}
                style={{ marginTop: 24 }}
                dataSource={list}
                columns={columns}
                pagination={pagination}
                scroll={{ x: 1100 }}
              />
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
