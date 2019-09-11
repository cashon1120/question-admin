import React, { Component } from 'react';
import {
  Form,
  Modal,
  Select,
  DatePicker,
  Input,
  Radio,
  Checkbox,
  Row,
  Col,
  InputNumber,
  TreeSelect,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { legalStr } from '@/utils/utils';

// import styles from './../index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

interface FormProps extends FormComponentProps {
  title: string;
  columns: any[];
  width?: number;
  okText?: string;
  cancelText?: string;
  zIndex?: number;
  visible?: boolean;
  confirmLoading?: boolean;
  isfooter?: boolean;

  onOk: (param?: object) => void;
  onCancel: () => void;
}

interface IcolumnsObj {
  showStatu: string;
}

class ModalFrom extends Component<FormProps, {}> {
  render() {
    const {
      form,
      title,
      width,
      okText,
      cancelText,
      zIndex,
      visible,
      confirmLoading,
      onOk,
      onCancel,
      isfooter,
    } = this.props;
    const columns = this.props.columns.filter(
      (item: IcolumnsObj) => item && item.showStatu !== 'hide' && item.showStatu !== 'hideModal',
    );
    const { TreeNode } = TreeSelect;

    const okHandle = () => {
      form.validateFields((err: string, fieldsValue: object) => {
        if (err) return;
        onOk(fieldsValue);
      });
    };

    const treeSelectNode = (
      treeList?: any,
      valueKey?: any,
      nameKey?: any,
      conentKey?: any,
      upVal?: any,
    ) =>
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
                return treeSelectNode(
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
      });

    interface IFooter {
      footer: boolean | null;
    }
    const footer: IFooter = {
      footer: false,
    };
    if (!isfooter) {
      footer.footer = null;
    }

    return (
      <Modal
        destroyOnClose
        width={width || 560}
        okText={okText || '确定'}
        cancelText={cancelText || '取消'}
        zIndex={zIndex || 1000}
        title={title || ''}
        visible={visible || false}
        onOk={okHandle}
        confirmLoading={confirmLoading || false}
        onCancel={onCancel}
      >
        <Row type="flex" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {columns.map((item: any) => {
            let rulesObj: any[] = [];
            if (
              item.componentType === 'Select' ||
              item.componentType === 'Radio' ||
              item.componentType === 'TreeSelect' ||
              item.componentType === 'TreeSelectForDj' ||
              item.componentType === 'DatePicker' ||
              item.componentType === 'RangePicker' ||
              item.componentType === 'Upload' ||
              item.componentType === 'AreaCascader' ||
              // item.componentType === 'InputNumber' ||
              item.componentType === 'Cascader'
            ) {
              // 这些类型的规则如果加了 min 和 validator 要出问题...
              rulesObj = [
                {
                  required: item.required || false,
                  message: item.requiredMessage || '',
                },
              ];
            } else {
              rulesObj = [
                {
                  required: item.required || false,
                  message: item.requiredMessage || '',
                  min: item.requiredmin || 1,
                  validator: item.validator || false,
                },
              ];
              if (item.componentType === 'Input' && !item.noPattern) {
                rulesObj.push({
                  message: '请输入合法的字符',
                  pattern: legalStr,
                });
              }
              if (item.priceRange) {
                delete rulesObj[0].validator;
                rulesObj.push({
                  validator: item.validator || false,
                });
              }
              if (item.componentType === 'InputNumber' && !item.validator) {
                delete rulesObj[0].min;
                delete rulesObj[0].validator;
              }
            }
            return (
              <Col md={item.col || 23} sm={(item.col || 23) * 3} key={item.title}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 15 }}
                  label={item.title}
                  className={item.className}
                  extra={item.extra || ''}
                >
                  {form.getFieldDecorator(item.dataIndex, {
                    rules: rulesObj,
                    initialValue: item.initialValue,
                  })(
                    (fItem => {
                      let componentTem = (
                        <Input
                          placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                          className={fItem.childclassName}
                          disabled={fItem.disabled}
                          onBlur={e => fItem.onBlur && fItem.onBlur(e, form)}
                        />
                      );
                      if (fItem.componentType === 'Select') {
                        componentTem = (
                          <Select
                            style={{ width: '100%' }}
                            mode={fItem.multiple ? 'multiple' : ''}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请选择'}
                            className={fItem.childclassName}
                            disabled={fItem.disabled}
                            onChange={(text, e) => {
                              if (fItem.validatorSelect) {
                                fItem.handleChange(text, e, form);
                              } else if (fItem.handleChange) {
                                fItem.handleChange(text, e);
                              }
                            }}
                          >
                            {fItem.dataSource.map((selData: any) => (
                              <Option
                                key={`selectIndex${selData.value || selData.id}`}
                                value={selData.value || selData.id}
                              >
                                {selData.name || (fItem.selectName && selData[fItem.selectName])}
                              </Option>
                            ))}
                          </Select>
                        );
                      } else if (fItem.componentType === 'DatePicker') {
                        const formatRangePicker: any = {};
                        if (fItem.showTime) {
                          formatRangePicker.showTime = fItem.showTime;
                        }
                        if (fItem.format) {
                          formatRangePicker.format = fItem.format;
                        }
                        componentTem = (
                          <DatePicker
                            style={{ width: '100%' }}
                            placeholder=""
                            disabled={fItem.disabled}
                            {...formatRangePicker}
                          />
                        );
                      } else if (fItem.componentType === 'RangePicker') {
                        const formatRangePicker: any = {};
                        if (fItem.showTime) {
                          formatRangePicker.showTime = fItem.showTime;
                        }
                        if (fItem.format) {
                          formatRangePicker.format = fItem.format;
                        }
                        componentTem = (
                          <RangePicker
                            style={{ width: '100%' }}
                            placeholder=""
                            disabled={fItem.disabled}
                            {...formatRangePicker}
                          />
                        );
                      } else if (fItem.componentType === 'Radio') {
                        componentTem = (
                          <RadioGroup
                            disabled={fItem.disabled}
                            onChange={
                              fItem.onChange
                                ? (e: any) => {
                                    fItem.onChange(e, form);
                                  }
                                : undefined
                            }
                          >
                            {fItem.dataSource.map((selData: any) => (
                              <Radio key={`selectIndex${selData.value}`} value={selData.value}>
                                {selData.name}
                              </Radio>
                            ))}
                          </RadioGroup>
                        );
                      } else if (fItem.componentType === 'Input') {
                        componentTem = (
                          <Input
                            addonBefore={fItem.addonBefore}
                            addonAfter={fItem.addonAfter}
                            disabled={fItem.disabled}
                            type={fItem.type ? fItem.type : 'text'}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            className={fItem.childclassName}
                          />
                        );
                      } else if (fItem.componentType === 'TextArea') {
                        componentTem = (
                          <TextArea
                            disabled={fItem.disabled}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            name={fItem.dataIndex}
                            autosize={fItem.autosize}
                            rows={4}
                            className={fItem.childclassName}
                          />
                        );
                      } else if (fItem.componentType === 'InputNumber') {
                        componentTem = (
                          <InputNumber
                            disabled={fItem.disabled}
                            style={{ width: '100%' }}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            name={fItem.dataIndex}
                            className={fItem.childclassName}
                            min={0}
                            formatter={fItem.formatter}
                            onChange={e => fItem.onChange && fItem.onChange(e, form)}
                          />
                        );
                      } else if (fItem.componentType === 'PassWorld') {
                        componentTem = (
                          <Input
                            type="password"
                            style={{ width: '100%' }}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请输入'}
                            name={fItem.dataIndex}
                            className={fItem.childclassName}
                          />
                        );
                      } else if (fItem.componentType === 'TreeSelect') {
                        componentTem = (
                          <TreeSelect
                            style={{ width: '100%' }}
                            disabled={fItem.disabled}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            className={fItem.childclassName}
                            treeData={fItem.dataSource}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请选择'}
                            treeDefaultExpandAll
                            onChange={fItem.onChange}
                          />
                        );
                      } else if (fItem.componentType === 'TreeSelectForDj') {
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
                            // onChange={fItem.onChange}
                          >
                            {treeSelectNode(
                              fItem.dataSource || [],
                              fItem.valueKey || '',
                              fItem.nameKey || '',
                              fItem.conentKey || '',
                            )}
                          </TreeSelect>
                        );
                      } else if (fItem.componentType === 'Cascader') {
                        componentTem = (
                          <Cascader
                            disabled={fItem.disabled}
                            style={{ width: fItem.width }}
                            options={fItem.dataSource}
                            placeholder={fItem.placeholder ? fItem.placeholder : '请选择'}
                          />
                        );
                      } else if (fItem.componentType === 'Checkbox') {
                        componentTem = <Checkbox></Checkbox>;
                      } else if (fItem.componentType === 'TableChoose') {
                        componentTem = fItem.renderTable();
                      } else if (fItem.render) {
                        componentTem = fItem.render();
                      }
                      return componentTem;
                    })(item),
                  )}
                </FormItem>
              </Col>
            );
          })}
        </Row>
      </Modal>
    );
  }
}

export default Form.create<FormProps>()(
  connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({}))(ModalFrom),
);
