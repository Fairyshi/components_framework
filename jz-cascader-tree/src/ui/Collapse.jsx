import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Button, Icon } from 'antd';

// import styles from '@alipay/jz-cascader-tree/assets/index.less';

/**
 * @component 收起|展开 控制器
 */
export default class Collapse extends PureComponent {
  static propTypes = {
    status: PropTypes.string,
  };

  static COLLAPSE_STATUS = {
    OPEN: 'open',
    CLOSE: 'close',
  };

  static defaultProps = {
    status: Collapse.COLLAPSE_STATUS.OPEN,
  };

  state = {
    status: Collapse.COLLAPSE_STATUS.OPEN,
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.status in Collapse.COLLAPSE_STATUS &&
      nextProps.status !== this.state.status
    ) {
      this.setState({ status: nextProps.status });
    }
  }

  toggleCollapse = () => {
    const { status } = this.state;

    this.setState({
      status: status === Collapse.COLLAPSE_STATUS.OPEN
        ? Collapse.COLLAPSE_STATUS.CLOSE
        : Collapse.COLLAPSE_STATUS.OPEN
    });
  };

  render() {
    const { trigger, className, children } = this.props;
    const { status } = this.state;

    const clx = classNames(
      className, 
      "cascadertree-collapsew", 
      { 
        "cascadertree-collapsew-close": status === Collapse.COLLAPSE_STATUS.CLOSE
      }
    );

    const jsxTrigger = trigger || (
      // 默认
      status === Collapse.COLLAPSE_STATUS.OPEN 
        ? <Button size="small"><Icon type="up" /></Button> 
        : <Button size="small"><Icon type="down" /></Button> 
    );

    return (
      <div className={clx}>
        <div 
          className="cascadertree-triggerw"
          onClick={this.toggleCollapse}
        >
          {jsxTrigger}
        </div>
        <div className="cascadertree-contentw">
          <div className="cascadertree-innerw">
            {children || <div />}
          </div>
        </div>        
      </div>
    );
  }
}
