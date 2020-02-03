import React from "react";
import {RouteView} from "fengwuxp-routing-core";

export interface CreateDemoViewProps {

}

interface CreateDemoViewState {

}

/**
 * 创建 demo
 */
@RouteView()
export default class CreateDemoView extends React.Component<CreateDemoViewProps, CreateDemoViewState> {

  render(): React.ReactElement {
    return <div>
      demo create
    </div>
  }
}
