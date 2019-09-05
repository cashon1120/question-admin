import React, {Fragment} from 'react';
import {Table} from 'antd';
import styles from './index.less';

interface IColumn {
  needTotal : boolean;
  showStatu : string;
  dataIndex : string;
}

interface IOnChange {
  (pagination : any, filters : any, sorter : any) : string;
}

interface IProps {
  columns : any;
  onSelectRow?: any;
  onSelect?: any;
  onSelectAll?: any;
  onChangeCombine : any;
  onChange?: IOnChange;
  scroll?: any;
  showSelectRow?: any;
  data : any;
  loading? : boolean;
  rowKey?: any;
  bordered?: boolean;
  ispagination?: boolean;
  showRowNum?: boolean;
  selectedRowKeys?: any[];
  selectType?: any;
  columnTitle?: string;
  marginTop?: number;
  onRow?: any;
}

interface IState {
  pcolumns : [];
  needTotalList : any[];
  columns : any[];
  amountWidth : any;
}

function initTotalList(columns : []) : any[] {
  const totalList : any[] = [];
  if (columns) {
    columns.forEach((column : IColumn) => {
      if (column.needTotal) {
        totalList.push({
          ...column,
          total: 0
        });
      }
    });
  }
  return totalList;
}

class StandardTable extends React.PureComponent < IProps,
IState > {
  constructor(props : any) {
    super(props);
    const {columns} = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      needTotalList,
      pcolumns: [],
      columns: [],
      amountWidth: 0
    };
  }

  componentWillMount() {
    const {columns} = this.props;
    const nColumns = this.filterColumns(columns);
    this.setState({pcolumns: columns, columns: nColumns});

    this.countAmountWidth(nColumns);
  }

  componentWillReceiveProps(nextProps : any) {
    const {pcolumns} = this.state;
    const {columns} = nextProps;
    if (columns && JSON.stringify(pcolumns) !== JSON.stringify(columns)) {
      const nColumns = this.filterColumns(columns);
      this.setState({pcolumns: columns, columns: nColumns});

      this.countAmountWidth(nColumns);
    }
  }

  handleRowSelectChange = (selectedRowKeys : [], selectedRows : []) => {
    let {needTotalList} = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex]), 0)
    }));
    const {onSelectRow} = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRowKeys, selectedRows);
    }
    this.setState({needTotalList});
  };

  handleRowSelect = (record : any, selected : [], selectedRows : []) => {
    const {onSelect} = this.props;
    if (onSelect) {
      onSelect(record, selected, selectedRows);
    }
  };

  handleOnSelectAll = (selected : [], selectedRows : [], changeRows : []) => {
    const {onSelectAll} = this.props;
    if (onSelectAll) {
      onSelectAll(selected, selectedRows, changeRows);
    }
  };

  handleTableChange = (pagination : any, filters : any, sorter : any) => {
    const {onChange, onChangeCombine} = this.props;
    if (onChangeCombine) {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      };
      onChangeCombine(params);
    } else if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  filterColumns = (columns : []) => columns.filter((item : IColumn) => item.showStatu !== 'hide' && item.showStatu !== 'hideTable');

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  // 设置序号表头
  resetColumn = (column : any, data : any) => {
    const hasIndex = column.some((item : IColumn) => item.dataIndex === 'serialNumber');
    if (!hasIndex) {
      column.splice(0, 0, {
        title: '序号',
        dataIndex: 'serialNumber',
        width: 60
      });
    }

    data.map((item : any, index : number) => {
      const obj = item;
      obj.serialNumber = index + 1;
      return obj;
    });
  };

  // 计算总宽度
  countAmountWidth = (columns : any) => {
    const {scroll, showSelectRow, showRowNum} = this.props;
    if (scroll) {
      let amountWidth = columns.reduce((total : any, item : any) => total + (item.width || 100), 0);
      if (showSelectRow) {
        amountWidth += 60;
      }
      if (showRowNum) {
        amountWidth += 60;
      }
      this.setState({
        amountWidth: {
          x: amountWidth,
          y: false
        }
      });
    }
  };

  render() {
    const {
      data: {
        data,
        list
      },
      loading,
      rowKey,
      showSelectRow,
      bordered,
      ispagination,
      showRowNum,
      selectedRowKeys,
      selectType,
      columnTitle,
      scroll
    } = this.props;
    let {data: {
        pagination
      }} = this.props;
    const {amountWidth, columns} = this.state;
    let dataSource = data || list;
    if (!!dataSource && !Array.isArray(dataSource)) {
      if (!pagination) {
        pagination = {};
      }
      if (dataSource) {
        pagination.current = dataSource.pageNum;
        pagination.total = dataSource.total;
        pagination.pageNum = dataSource.pageNum;
        pagination.pageSize = dataSource.pageSize;
      }
      dataSource = dataSource.list;
    }

    if (showRowNum && columns && dataSource) {
      this.resetColumn(columns, dataSource);
    }

    let paginationProps = null;
    if (ispagination === false) {
      paginationProps = false;
    } else {
      paginationProps = {
        showTotal: (total : number) => `总共 ${total} 条数据`,
        showSizeChanger: true,
        ...pagination,
        showQuickJumper: true,
        pageSizeOptions: [
          '10',
          '15',
          '20',
          '30',
          '40',
          '50'
        ]
      };
    }
    const rowSelection : any = showSelectRow
      ? {
        selectedRowKeys,
        type: selectType || 'checkbox',
        columnTitle: columnTitle || '',
        onChange: this.handleRowSelectChange,
        onSelect: this.handleRowSelect,
        onSelectAll: this.handleOnSelectAll,
        getCheckboxProps: (record : any) => ({disabled: record.disabled})
      }
      : null;
    const {marginTop, onRow} = this.props;
    const onRowTable = {
      onRow
    } || {};
    return (
      <Fragment>
        <div
          className={marginTop === 0
          ? null
          : styles.standardTable}>
          <Table
            bordered={bordered}
            columns={columns || []}
            dataSource={dataSource || []}
            loading={loading}
            onChange={this.handleTableChange}
            pagination={paginationProps}
            rowKey={rowKey || columns[0].dataIndex}
            rowSelection={rowSelection}
            scroll={scroll
            ? amountWidth
            : {}}
            size="middle"
            {...onRowTable}/>
        </div>
      </Fragment>
    );
  }
}

export default StandardTable;
