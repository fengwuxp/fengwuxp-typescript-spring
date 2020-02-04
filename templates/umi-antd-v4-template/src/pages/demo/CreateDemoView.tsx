import React from "react";
import {RouteView, ViewShowMode} from "fengwuxp-routing-core";
import {AntdRouteViewOptions} from "fengwuxp-routing-antd";
import {ModalProps} from "antd/lib/modal/Modal";

export interface CreateDemoViewProps {

}

interface CreateDemoViewState {

}

/**
 * 创建 demo
 */
@RouteView<AntdRouteViewOptions & ModalProps>({
  showMode: ViewShowMode.DIALOG,
  pageHeader: {
    content: "demo 创建"
  },
})
export default class CreateDemoView extends React.Component<CreateDemoViewProps, CreateDemoViewState> {

  render(): React.ReactElement {
    return <div>
      demo create
    </div>
  }
}
