import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { toArr } from '../util';
import { PreviewList as PreviewListUi } from '../ui';

/**
 * @component 
 */
export default class PreviewList extends PureComponent {
  static propTypes = {
    readOnly: PropTypes.bool,
    store: PropTypes.shape({
      keyField: PropTypes.string,
      emitter: PropTypes.object.isRequired,
      cache: PropTypes.object,
      value: PropTypes.array,
      data: PropTypes.array,
    }),
  };

  static defaultProps = {
    readOnly: false,
    store: {
      keyField: 'fid',
      emitter: null,
      cache: {},
      value: [],
      data: [],
    },
  };
  
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const { store } = this.props;
    const self = this;

    if (store) {
      this.unsubscribe = store.subscribe((event) => {
        self.setState({
          data: event.data || [],
        });
      });
    }
  }

  componentWillReceiveProps() {
    const { store } = this.props;
    const self = this;

    if (store) {
      store.subscribe((event) => {
        self.setState({
          data: event.data || [],
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }   
  }

  render() {
    const { data = [] } = this.state;

    if (
      toArr(data).length === 0
    ) return null;
    
    return (<PreviewListUi data={data} />);
  }
}
