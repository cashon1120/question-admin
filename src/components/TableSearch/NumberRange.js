import React, { PureComponent } from 'react';
import { Input } from 'antd';

export default class PriceInput extends PureComponent {
  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      start: value.start,
      end: value.end,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      if (!value) {
        this.setState({ start: undefined, end: undefined });
      } else {
        this.setState({ start: value.start, end: value.end });
      }
    }
  }

  clearInputVal = () => {
    this.state = {
      start: '',
      end: '',
    };
  };

  handleStartChange = e => {
    const start = parseInt(e.target.value || 0, 10);
    if (!('value' in this.props)) {
      this.setState({ start });
    }
    this.triggerChange({ start });
  };

  handleEndChange = e => {
    const end = parseInt(e.target.value || 0, 10);
    if (!('value' in this.props)) {
      this.setState({ end });
    }
    this.triggerChange({ end });
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { start, end } = this.state;
    return (
      <span>
        <Input
          type="text"
          value={start}
          onChange={this.handleStartChange}
          style={{ width: '45%', marginRight: 1 }}
        />
        -
        <Input
          type="text"
          value={end}
          onChange={this.handleEndChange}
          style={{ width: '45%', marginLeft: 1 }}
        />
      </span>
    );
  }
}
