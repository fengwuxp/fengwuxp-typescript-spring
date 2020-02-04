import React, {useState} from 'react';
import {RouteView} from 'fengwuxp-routing-core';
import {AntdRouteViewOptions} from 'fengwuxp-routing-antd';
import {Button, Card, Dropdown, Menu, Table} from 'antd';
import {ColumnProps} from 'antd/es/table/Column';
import DateFormatUtils from 'fengwuxp-common-utils/lib/date/DateFormatUtils';
import {PaginationConfig} from 'antd/es/pagination';
import {Key, SorterResult, TableCurrentDataSource} from 'antd/lib/table/interface';
import {TableRowSelection} from 'antd/es/table/interface';
import {ClickParam} from 'antd/lib/menu';
import {
  DownOutlined,
  PlusOutlined,
  UpOutlined,
  FormOutlined,
  DeleteOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  FormItemGrid,
  Submit,
  Reset,
  createFormActions,
} from '@uform/antd/esm';
import classNames from 'classnames';
import AppRouter from '@/AppRouter';
import MockService from '@/feign/MockService';
import {DemoItem, Sex} from '../../../mock/dmeo_table';
import styles from './style.less';
import marginStyles from '@/assets/styles/margin.less';


const defautColumns: ColumnProps<DemoItem>[] = [
  {
    title: 'ID',
    align: 'center',
    dataIndex: 'id',
    key: 'id',
    sorter: true,
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    align: 'center',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '生日',
    align: 'center',
    dataIndex: 'birthday',
    key: 'birthday',
    render: val => DateFormatUtils.formatterDateToYYMMDD(val),
    sorter: true,
  },
  {
    title: '头像',
    align: 'center',
    dataIndex: 'avatar',
    key: 'avatar',
    render: url => {
      if (url) {
        return <img src={url}/>
      }
      return '--';
    },
  },
  {
    title: '性别',
    align: 'center',
    dataIndex: 'sex',
    key: 'sex',
    render: sex => {
      if (sex == null) {
        return '--';
      }
      switch (sex) {
        case Sex.MAN:
          return '男';
        case Sex.WOMAN:
          return '女'
      }
      return '--';
    },
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    render: (text, record) => <span>
          <a href="javascript:;"><FormOutlined title="编辑"/></a>
          <a className={classNames(marginStyles.margin_left_20)} href="javascript:;"><SnippetsOutlined title="查看"/></a>
          <a className={classNames(marginStyles.margin_left_20)} href="javascript:;"><DeleteOutlined
            title="删除"/></a>
        </span>,
  },
];

export interface DemoListViewProps {

}

interface DemoListViewState {
  records: DemoItem[];
  columns: ColumnProps<DemoItem>[];
  loading: boolean;
  pagination: PaginationConfig;
  selectedRowKeys: Key[];
  filters?: Record<string, Key[] | null>,
  sorter?: SorterResult<DemoItem> | SorterResult<DemoItem>[];
}


/**
 *  demo list
 */
@RouteView<AntdRouteViewOptions>({
  pageHeader: {
    content: 'demo list',
  },
})
export default class DemoListView extends React.Component<DemoListViewProps, DemoListViewState> {
  state: DemoListViewState = {
    records: null,
    columns: defautColumns,
    loading: true,
    pagination: {
      current: 1,
      pageSize: 10,
      position: 'bottom',
      showQuickJumper: true,
      defaultPageSize: 10,
      // hideOnSinglePage: true,
      showSizeChanger: true,
      onShowSizeChange: (current: number, size: number) => {
        this.setState({
          pagination: {
            ...this.state.pagination,
            current: 1,
            pageSize: size,
          },
        }, this.loadNextData)
      },
    },
    selectedRowKeys: [],
  };


  componentDidMount(): void {
    console.log('---DemoListView----->', this.props);
    this.loadNextData();
  }

  render(): React.ReactElement {
    const {columns, loading, records, pagination, selectedRowKeys} = this.state;
    const rowSelection: TableRowSelection<DemoItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      // getCheckboxProps: (record) => record
    };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量处理</Menu.Item>
      </Menu>
    );
    // let location = useLocation();
    return <Card bordered={false}>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <div className={styles.tableListOperator}>
          <Button icon={<PlusOutlined/>} type="primary" onClick={() => {
            AppRouter.demoCreateView();
          }}>新建</Button>
          {selectedRowKeys.length > 0 && (
            <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <DownOutlined/>
                    </Button>
                  </Dropdown>
                </span>
          )}
        </div>
        <Table columns={columns}
               loading={loading}
               rowKey="id"
               pagination={pagination}
               rowSelection={rowSelection}
               onChange={this.tableOnChange}
               dataSource={records}/>
      </div>
    </Card>
  }


  private renderForm = () => <AdvancedSearchForm/>;

  private tableOnChange = (pagination: PaginationConfig,
                           filters: Record<string, Key[] | null>,
                           sorter: SorterResult<DemoItem> | SorterResult<DemoItem>[],
                           extra: TableCurrentDataSource<DemoItem>) => {
    console.log('pagination', pagination, filters, sorter, extra);
    this.setState({
      filters,
      sorter,
      pagination,
    }, this.loadNextData)
  };

  private loadNextData = () => {
    this.setState({
      loading: true,
    });
    const {pagination} = this.state;
    MockService.queryDemoList({
      querySize: pagination.pageSize,
      queryPage: pagination.current,
    }, {
      useProgressBar: false,
    }).then(({records, total}) => {
      // console.log("--records->", records);
      this.setState({
        records,
        pagination: {
          total,
          ...pagination,
        },
      })
    }).finally(() => {
      this.setState({
        loading: false,
      })
    })
  };

  private handleRowSelectChange: TableRowSelection<DemoItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: DemoItem[],
  ) => {
    console.log('selectedRowKeys', selectedRowKeys, selectedRows);
    this.setState({selectedRowKeys});
  };

  private handleMenuClick = (param: ClickParam) => {

  }
}

const actions = createFormActions();

/**
 * 高级查询表单
 * @constructor
 */
const AdvancedSearchForm = props => {
  const [expand, setExpand] = useState(false);

  return (
    <SchemaForm
      onSubmit={v => {
        console.log('==>', v)
      }}
      actions={actions}
      inline
      onValidateFailed={results => {
        console.log('results', results);
      }}
    >
      <FormItemGrid gutter={20}>
        <Field type="string" name="a1" title="查询字段1"/>
        <Field type="string" name="a2" title="查询字段2"/>
        <Field type="string" name="a3" title="查询字段3"/>
        <Field type="string" name="a4" title="查询字段4"/>
      </FormItemGrid>
      {
        expand && <FormItemGrid gutter={20}>
          <Field type="string" name="a5" title="查询字段5"/>
          <Field type="string" name="a6" title="查询字段6"/>
        </FormItemGrid>
      }
      <FormButtonGroup offset={4}>
        <Submit htmlType="button"/>
        <Reset/>
        <span onClick={() => setExpand(!expand)}>
          {
            expand ? <span>
            <UpOutlined title="收起"/>收起
          </span> :
              <span>
                <DownOutlined title="展开"/>展开
              </span>
          }
       </span>
      </FormButtonGroup>
    </SchemaForm>
  );
};
