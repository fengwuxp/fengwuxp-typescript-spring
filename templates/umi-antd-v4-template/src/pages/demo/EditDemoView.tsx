import React from 'react';
import {RouteView} from "fengwuxp-routing-core";
import {AntdRouteViewOptions} from "fengwuxp-routing-antd";


export interface DemoDetailViewProps {

}

interface DemoDetailViewState {

}

@RouteView<AntdRouteViewOptions>({
  pageHeader: {
    content: 'demo 编辑',
  }
})
export default class DemoDetailView extends React.Component<DemoDetailViewProps, DemoDetailViewState> {


  constructor(props: DemoDetailViewProps, context: any) {
    super(props, context);
  }

  render = (): React.ReactElement => {
    return <div>

    </div>
  }
};
