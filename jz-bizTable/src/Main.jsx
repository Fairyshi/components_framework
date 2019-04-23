import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Table } from 'antd';
import ClipBoard from './ClipBoard';
import { 
  formatFloat, 
  formatInteger, 
  formatPercentage, 
  isFunction, 
  isEmptyObject, 
  noop,
  getYMD,
  getTime,
} from './util';

import styles from 'antd/es/style/index.css';

const TABLE_COLUMN = 'table-column';
const TABLE_COLUMN_PREFIX = 'table-column-prefix';
const TABLE_COLUMN_CONTENT = 'table-column-content';
const TABLE_COLUMN_SUFFIX = 'table-column-suffix';
const ANTD_ERROR_CSS_NAME = 'has-error';

/**
 * 对Antd Table的业务封装：支持对表进行业务配置等功能
 */
export default class BizTableMonitor extends PureComponent {
  static propTypes = {
    config: {
      dispatch: PropTypes.func.isRequired,
      // dispacth 的effect的指定名称空间
      namespace: PropTypes.string.isRequired,
      // dispatch指定namespace中的指定effect名称
      effect: PropTypes.string,
    },
    
  };

  static defaultProps = {
    config: {
      // 触发请求列表数据
      effect: 'masterList',
    }
  };

  componentDidMount() {
    const { config = {} } = this.props;
    const { dispatch, namespace, effect } = config;
    const payload = {};

    if (isFunction(dispatch)) {
      dispatch({
        type: `${namespace}/${effect}`,
        payload
      });
    }
  }

  /**
   * 根据配置参数解析出对应的类名
   * column._config: {
   *   ellipsis: true, // 单行省略号
   *   multiEllipsis: number, // 多行省略号
   *   prefixColor: red, // 前缀点
   *   prefix: node, // 文字前缀
   *   suffix: node, // 文字后缀
   *   clipboard: string, // 剪贴板 
   *   format: percentage | float | date, // 数据格式化 百分比 | 小数点 | 日期
   *   href: string, // <a href="" /> 超链接
   * }
   */  
  getColumnClx = (column = {}) => {
    if (!('_config' in column)) return TABLE_COLUMN;

    const { 
      // 单行换行
      ellipsis,
      // 多行换行
      multiEllipsis,
      // 前缀
      prefix,
      // 前缀颜色标记
      prefixColor,
      // 后缀
      suffix,
      // 剪贴板
      clipboard,
      // 格式化
      format,
      // 超链接
      href,
      // 文本右对齐
      textRight,
    } = column._config;

    const clx = classNames(
      TABLE_COLUMN, {
      // 单行省略号
      [`${TABLE_COLUMN}-ellipsis`]: !!ellipsis,
      // 多行省略号
      [`${TABLE_COLUMN}-multiEllipsis`]: !!multiEllipsis,
      // 前缀颜色标记
      [`${TABLE_COLUMN}-prefixed`]: !!(prefix || prefixColor),
      // 后缀剪贴板
      [`${TABLE_COLUMN}-suffixed`]: !!(suffix || clipboard),
      // 百分数列右对齐
      [`${TABLE_COLUMN}-textright`]: textRight || (format && format.percentage),
    });

    return clx;
  };

  getColorDot = (colorName) => {
    return (
      <span 
        className={`${TABLE_COLUMN}-colordot`} 
        style={{ background: colorName }} 
      />
    );
  };

  // 复制到剪贴板
  getClipboard = (text) => (<ClipBoard value={text} />);

  // 常见的列内容格式化
  formatContent = (formatter, text) => {
    const formatters = {
      // 格式化百分数
      percentage: formatPercentage,
      // 格式化：浮点数，保留两位小数
      float: formatFloat,
      // 格式化：整数
      integer: formatInteger,
      // 日期
      date: getYMD,
      // 时间
      time: getTime,
    };
    const innerFormat = ( 
      formatter 
        && typeof formatter === 'string' 
        && formatter in formatters
    ) 
      ? formatters[formatter] 
      : null

    return innerFormat ? innerFormat(text) : text;
  }

  autoRender = (column) => {
    if (
      !('_config' in column) 
        || isEmptyObject(column._config)
    ) return {};

    // 根据 column中_config的配置解析并填充附加列信息
    const render = (_text, record, index) => {
      const arrPrefix = [];
      const arrSuffix = [];
      let content = null;
  
      const { 
        render: userRender, 
        dataIndex, 
        _config, 
        textAlign,
      } = column;
  
      if ('prefix' in _config) arrPrefix.unshift(_config.prefix);
      if ('prefixColor' in _config) {
        arrPrefix.unshift(
          this.getColorDot(_config.prefixColor)
        );
      }
      if ('suffix' in _config) arrSuffix.push(_config.suffix);

      let text = 'format' in _config 
        ? this.formatContent(_config.format, _text)
        : _text;

      if ('clipboard' in _config) {
        arrSuffix.push(
          this.getClipboard(text)
        );
      }

      // 超链接配置1：地址
      const href = _config.href;
      // 超链接配置2：组件
      const Link = this.props.Link;
      if (href) {
        const target = typeof href === 'string'
          ? href
          : href(record, index);

        text = Link 
          ? <Link to={target}>{text}</Link>
          : <a href={target}>{text}</a>;
      }

      content = isFunction(userRender) 
        ? userRender(text, record, index)
        : text;
      
      /* multiEllipsis 多行溢出的阀值行数*/
      const jsxContent = (
        <span 
          className={TABLE_COLUMN_CONTENT} 
          style={{ 
            "WebkitLineClamp": 'multiEllipsis' in _config 
              ? (_config.multiEllipsis || 2) 
              : undefined,
            textAlign: textAlign 
              || (('textRight' in _config) && 'right'),
          }}
        >
          {content}
        </span>
      );
      const clx = this.getColumnClx(column);
      return (
        <div className={clx}>
          <span className={TABLE_COLUMN_PREFIX}>{arrPrefix}</span>
          {jsxContent}
          <span className={TABLE_COLUMN_SUFFIX}>{arrSuffix}</span>
        </div>
      );
    };    

    return { render };
  };

  getColumns = cols => {
    const { columns = [] } = this.props;
    return (cols || columns).map(column => {
      const overwriteProps = this.autoRender(column);
      return {
        ...column,
        ...overwriteProps
      };
    });
  };

  // 行类名
  getRowClassName = (record, index) => {
    const { rowKey, errorInfo } = this.props;
    const rowClx = {};

    const rowPrimaryKey = record[rowKey];
    // 解析错误信息(errorInfo)，判断该行是否是含错行
    if (errorInfo && !isEmptyObject(errorInfo)) {
      Object.keys(errorInfo).forEach(errorKey => {
        if (
          errorKey === rowPrimaryKey 
            // 错误信息中该行含有错误列
            || errorKey.startsWith(`${rowPrimaryKey}.`)
        ) {
          rowClx[ANTD_ERROR_CSS_NAME] = true;
        }
      });
    }

    return rowClx;
  };

  render() {
    const { 
      prefixClx,
      className,
      dataSource,
      rowClassName,
      ...others
    } = this.props;

    const columns = this.getColumns();

    const overwriteProps = {
      className: classNames(prefixClx, className),
      rowClassName: (...args) => {
        return classNames(
          (rowClassName || noop)(...args), 
          this.getRowClassName(...args)
        );
      }
    };

    return (
      <Table 
        {...others}
        columns={columns} 
        dataSource={dataSource} 
        {...overwriteProps}
      />
    );
  }
}
