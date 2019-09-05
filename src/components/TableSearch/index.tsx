import React, { PureComponent } from 'react';
import {
  Button,
  Form,
  Select,
  TreeSelect,
  DatePicker,
  Input,
  Icon,
  Cascader,
  InputNumber,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import NumberRange from './NumberRange';
import { connect } from 'dva';

import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const InputGroup = Input.Group;
const dateFormat = 'YYYY-MM-DD';

interface FormProps extends FormComponentProps {
  columns: any[];
  simpleLen?: number;
  isExpandForm?: boolean;
  defaultData?: any;
  handleSearch: (params: any) => void;
  handleFormReset: () => void;
}

class TableSearch extends PureComponent<FormProps, {}> {
  state = {
    expandForm: {},
  };

  static defaultProps = {
    simpleLen: 3,
    isExpandForm: true,
    handleSearch: () => {},
    handleFormReset: () => {},
  };

  constructor(props: any) {
    super(props);
    const expandForm = { expandForm: false };
    if (props.expandForm) {
      expandForm.expandForm = true;
    }
    this.state = {
      ...expandForm,
    };
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
    this.createToggleForm();
  };

  createToggleForm = () => {
    const { isExpandForm } = this.props;
    const { expandForm } = this.state;
    return isExpandForm ? (
      <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
        {expandForm ? '收起' : '展开'}
        {expandForm ? <Icon type="up" /> : <Icon type="down" />}
      </a>
    ) : (
      ''
    );
  };

  TreeSelectNode = (
    treeList = [],
    valueKey: string,
    nameKey: string,
    conentKey: string,
    upVal?: any,
  ) => {
    const that = this;
    return (
      treeList &&
      treeList.map((item: any) => {
        const val = upVal ? `${upVal}-${item[valueKey || 'value']}` : item[valueKey || 'value'];
        return (
          <TreeNode
            key={`treeListIndex${val}`}
            value={val}
            title={item[nameKey || 'name']}
            disabled={item.disabled}
          >
            {(obj => {
              if (obj[conentKey || 'content']) {
                return that.TreeSelectNode(
                  obj[conentKey || 'content'],
                  valueKey,
                  nameKey,
                  conentKey,
                  val,
                );
              }
              return '';
            })(item)}
          </TreeNode>
        );
      })
    );
  };

  renderSimpleForm = () => {
    const { columns, simpleLen } = this.props;
    const len = Math.min(columns.length, simpleLen || 3);
    const simpleColumus = columns.slice(0, len);
    return this.createSearchForm(simpleColumus, columns);
  };

  renderAdvancedForm = () => {
    const { columns } = this.props;
    return this.createSearchForm(columns, columns);
  };

  componentDidMount = () => {
    // this.props.form.setFieldValue;
    // console.log(1);
    const { defaultData, form } = this.props;
    form.setFieldsValue(defaultData);
  };

  onChange() {}

  createSearchForm = (columns: any, realcolumns: any) => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <div className={styles.searchTable}>
          {columns &&
            columns.map((item: any) => (
              <div key={item.dataIndex}>
                <FormItem label={item.title}>
                  {getFieldDecorator(item.dataIndex, {
                    initialValue: item.initialValue,
                  })(
                    (fItem => {
                      let componentTem = <Input placeholder="请输入" />;
                      if (fItem.componentType === 'Select') {
                        componentTem = (
                          <Select
                            allowClear
                            placeholder="请选择"
                            style={{ minWidth: 150 }}
                            onSelect={fItem.onSelect && fItem.onSelect()}
                          >
                            {fItem.dataSource &&
                              fItem.dataSource.length &&
                              fItem.dataSource.map((selData: any) => (
                                <Option
                                  key={selData.id ? selData.id : `selectIndex${selData.value}`}
                                  value={selData.id ? selData.id : selData.value}
                                >
                                  {selData.name || (fItem.selectName && selData[fItem.selectName])}
                                </Option>
                              ))}
                          </Select>
                        );
                      } else if (fItem.componentType === 'DatePicker') {
                        componentTem = (
                          <DatePicker
                            style={{ width: '100%' }}
                            placeholder=""
                            format={dateFormat}
                          />
                        );
                      } else if (fItem.componentType === 'RangePicker') {
                        componentTem = (
                          <RangePicker allowClear format={dateFormat} style={{ width: '100%' }} />
                        );
                      } else if (fItem.componentType === 'Cascader') {
                        componentTem = (
                          <Cascader options={fItem.options} placeholder="请选择商品类别" />
                        );
                      } else if (fItem.componentType === 'InputGroup') {
                        componentTem = (
                          <InputGroup compact>
                            <InputNumber style={{ width: '40%' }} />
                            <Input
                              style={{
                                width: '15%',
                                borderLeft: 0,
                                pointerEvents: 'none',
                                backgroundColor: '#fff',
                              }}
                              placeholder="--"
                              disabled
                            />
                            <InputNumber
                              style={{ width: '40%', textAlign: 'center', borderLeft: 0 }}
                            />
                          </InputGroup>
                        );
                      } else if (fItem.componentType === 'TreeSelect') {
                        componentTem = (
                          <TreeSelect
                            showSearch={fItem.showSearch}
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                            filterTreeNode={(input, treeNode) => {
                              const node = treeNode;
                              return (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              );
                            }}
                            onChange={this.onChange}
                          >
                            {this.TreeSelectNode(
                              fItem.dataSource || [],
                              fItem.valueKey || '',
                              fItem.nameKey || '',
                              fItem.conentKey || '',
                            )}
                          </TreeSelect>
                        );
                      } else if (fItem.componentType === 'TreeSelect2') {
                        componentTem = (
                          <TreeSelect
                            treeData={fItem.dataSource || []}
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            treeDefaultExpandAll
                            onChange={this.onChange}
                          />
                        );
                      } else if (fItem.componentType === 'NumberRange') {
                        componentTem = <NumberRange />;
                      } else if (fItem.componentType === 'InputNumber') {
                        componentTem = <InputNumber style={{ width: '100%' }} />;
                      } else {
                        componentTem = <Input placeholder="请输入" />;
                      }
                      return componentTem;
                    })(item),
                  )}
                </FormItem>
              </div>
            ))}

          <div>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 3 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {realcolumns.length > 3 ? this.createToggleForm() : ''}
            </span>
          </div>
        </div>
      </Form>
    );
  };

  handleFormReset = () => {
    const { form, handleFormReset } = this.props;
    // form.setFieldsValue('priceRange', null);
    form.resetFields();
    handleFormReset();
  };

  handleSearch = (e: any) => {
    e.preventDefault();

    const { handleSearch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      handleSearch(values);
    });
  };

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default Form.create<FormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({}))(TableSearch),
);
