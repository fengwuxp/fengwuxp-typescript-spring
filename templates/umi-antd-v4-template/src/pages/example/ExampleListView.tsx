import * as React from "react";
import {Button, Input, Switch} from "antd";

import ProTable, {ProColumns} from "@ant-design/pro-table";
import "./styles.less";
import {RouteView} from "fengwuxp-routing-core";
import {AntdRouteViewOptions} from "fengwuxp-routing-antd";
import {ReactCmdDataProviderRouteViewOptions} from "fengwuxp-routing-react";
import {AntGlobalStateType} from "@/AntGlobalEventNames";
import {DemoListViewProps} from "@/pages/demo/DemoListView";
import {RequestData, UseFetchDataAction} from "@ant-design/pro-table/lib/useFetchData";
import {ExampleEntityInfo} from "@/feign/services/simple/info/ExampleEntityInfo";
import ExampleService from "@/feign/example/services/ExampleService";
import {QueryExampleEntityReq} from "@/feign/services/simple/req/QueryExampleEntityReq";
import {QueryType} from "oak-common";
import {Week} from "@/feign/enums/Week";


export interface ExampleListViewProps {

}


const weeks: any = Object.keys(Week).map((key) => {
  const item = Week[key];
  return {
    [key]: {
      text: item.desc
    }
  }
});

const columns: ProColumns[] = [
  {
    title: "ID",
    dataIndex: "id",
    copyable: true,
    hideInForm: true
  },
  {
    title: "姓名",
    dataIndex: "name",
    copyable: true
  },
  {
    title: "年龄",
    dataIndex: "age"
  },
  {
    title: "头像",
    dataIndex: "avatarUrl",
    ellipsis: true,
    width: 100,
    hideInForm: true
  },
  {
    title: "余额",
    dataIndex: "money",
    valueType: "money",
    hideInForm: true,
  },
  {
    title: "生日",
    key: "birthday",
    dataIndex: "birthday",
    valueType: "date"
  },
  {
    title: "星期",
    key: "week",
    dataIndex: "week",
    valueEnum: weeks
  },
  {
    title: "是否启用",
    key: "enable",
    dataIndex: "enable",
    render: (text, record: ExampleEntityInfo, index: number, action: UseFetchDataAction<RequestData<ExampleEntityInfo>>) => {

      return <Switch defaultChecked={text as boolean}/>
    }
  },
  {
    title: "操作",
    valueType: "option",
    dataIndex: "option",
    render: (text, row, index, action) => [
      <a onClick={() => {

      }}
      >编辑</a>,
      <a onClick={() => {
        action.reload();
      }}
      >
        详情
      </a>,
      <a
        onClick={() => {
          action.reload();
        }}
      >
        删除
      </a>,
    ]
  }
];


const getRequestHandle = (cacheTotal: number, setTotal) => {

  return (queryParam: QueryExampleEntityReq & {
    pageSize?: number;
    current?: number;
  }): Promise<RequestData<ExampleEntityInfo>> => {

    const queryPage = queryParam.current;
    const queryType = queryPage == 1 ? QueryType.QUERY_RESET : QueryType.QUERY_BOTH;
    const req: QueryExampleEntityReq & {
      pageSize?: number;
      current?: number;
    } = {
      ...queryParam,
      queryType,
      querySize: queryParam.pageSize,
      queryPage: queryPage
    };
    delete req.pageSize;
    delete req.current;

    return ExampleService.query(req, {useProgressBar: false}).then(({records, total}) => {
      setTotal(total);
      if (total == null) {
        total = cacheTotal;
      }
      return {
        data: records,
        success: true,
        total
      }
    })
  };

};


const ExampleListView = (props: ExampleListViewProps) => {
  const [queryName, setQueryName] = React.useState<string>("");
  const [total, setTotal] = React.useState<number>(0);
  return (
    <>
      <ProTable<ExampleEntityInfo, QueryExampleEntityReq>
        className="App"
        columns={columns}
        request={getRequestHandle(total, setTotal)}
        rowKey="key"
        params={{name: queryName}}
        toolBarRender={(action, rows) => [
          <Input.Search
            style={{
              width: 200
            }}
            onSearch={value => setQueryName(value)}
          />,
          <Button
            onClick={() => {

            }}
            type="primary">创建</Button>,
          <Button onClick={() => {
            action.reload();
          }} type="default">刷新</Button>,
          <Button onClick={() => {
            action.resetPageIndex();
          }} type="default">
            回到第一页
          </Button>
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          position: 'bottom',
          showQuickJumper: true,
          defaultPageSize: 10,
          // hideOnSinglePage: true,
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default RouteView<AntdRouteViewOptions & ReactCmdDataProviderRouteViewOptions<DemoListViewProps, AntGlobalStateType>>({
  pageHeader: {
    content: 'demo list',
  },
  cmdDataProvider: {
    propMapEventName: (names) => {
      console.log("--cmdDataProvider-->", {
        loginUser: names.loginUser
      });
      return {
        loginUser: names.loginUser
      }
    }
  }
})(ExampleListView);
