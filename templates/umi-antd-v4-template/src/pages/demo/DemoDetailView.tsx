import React from 'react';
import {RouteView} from "fengwuxp-routing-core";
import {AntdRouteViewOptions} from "fengwuxp-routing-antd";


export interface EditDemoViewProps {

}

interface EditDemoViewState {

}

@RouteView<AntdRouteViewOptions>({
  pageHeader: {
    content: 'demo 详情',
  },
})
export default class EditDemoView extends React.Component<EditDemoViewProps, EditDemoViewState> {
  render(): React.ReactElement {
    return <div>

    </div>
  }
}
