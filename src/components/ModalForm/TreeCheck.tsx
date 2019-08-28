import React, { PureComponent } from 'react';
import { Tree } from 'antd';
import { formatMessage } from 'umi/locale';

const { TreeNode } = Tree;

interface IProps {
  onClickChange: (params: any) => void;
  treeData: any;
  nextNodeName: any;
  defaultExpandAll: any;
  checkedKeys: any;
}

class TreeCheck extends PureComponent<IProps, any> {
  state = {
    selectedKeys: [],
    checkStrictly: true,
  };

  onCheck = (checkedKeys: any) => {
    const { onClickChange } = this.props;
    let result = [];
    if (checkedKeys && checkedKeys.checked) {
      const keyArr = checkedKeys.checked.concat();
      checkedKeys.checked.map((item: any) => {
        if (item) {
          const temArr = item.split('-');
          if (temArr.length === 2) {
            // keyArr.splice(0, 0, ...temArr);
            keyArr.push(temArr[0]);
          }
          if (temArr.length === 3) {
            // keyArr.splice(0, 0, ...temArr);
            keyArr.push(temArr[0]);
            keyArr.push(`${temArr[0]}-${temArr[1]}`);
          }
        }
        return null;
      });
      result = keyArr.filter(
        (element: any, index: number, arr: []) => arr.indexOf(element) === index,
      );
    }
    onClickChange(result);
    // this.setState({ checkedKeys: result });
  };

  onSelect = (selectedKeys: any) => {
    this.setState({ selectedKeys });
  };

  renderTreeNodes = (data: any, nextNodeName: any, parentId?: number, parentLocale?: any) =>
    data.map((item: any) => {
      const pId = parentId ? `${parentId}-${item.id}` : item.id;
      let locale = item.name || '';
      const regExp = new RegExp('[A-Za-z]+');
      let needFormat = false;
      if (item.name && regExp.test(item.name)) {
        needFormat = true;
        locale = `${parentLocale || 'menu'}.${item.name}`;
      }
      if (item[nextNodeName]) {
        return (
          <TreeNode
            title={needFormat ? formatMessage({ id: locale }) : locale}
            key={pId}
            dataRef={item}
          >
            {this.renderTreeNodes(item[nextNodeName], nextNodeName, pId, locale)}
          </TreeNode>
        );
      }
      return (
        <TreeNode {...item} key={pId} title={needFormat ? formatMessage({ id: locale }) : locale} />
      );
    });

  render() {
    const { treeData, nextNodeName, defaultExpandAll, checkedKeys } = this.props;
    const { selectedKeys, checkStrictly } = this.state;
    return (
      <Tree
        checkable
        defaultExpandAll={defaultExpandAll}
        checkStrictly={checkStrictly}
        onCheck={this.onCheck}
        checkedKeys={checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={selectedKeys}
      >
        {this.renderTreeNodes(treeData, nextNodeName)}
      </Tree>
    );
  }
}

export default TreeCheck;
