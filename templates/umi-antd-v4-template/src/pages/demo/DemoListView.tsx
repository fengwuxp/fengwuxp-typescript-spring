import React from "react";
import {RouteView} from "fengwuxp-routing-core";
import {AntdRouteViewOptions} from "fengwuxp-routing-antd";


export interface CreateDemoViewProps {

}

interface CreateDemoViewState {

}

/**
 *  demo list
 */
@RouteView<AntdRouteViewOptions>({
  pageHeader: {
    content: "demo list"
  },
})
export default class DemoListView extends React.Component<CreateDemoViewProps, CreateDemoViewState> {

  render(): React.ReactElement {

    // return   <PageHeaderWrapper backIcon={<ArrowLeftOutlined/>}>
    //
    // </PageHeaderWrapper>

    return <div>
      demo list
    </div>
  }
}
