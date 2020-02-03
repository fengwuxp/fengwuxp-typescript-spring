import React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface LoginViewProps {

}

interface LoginViewState {

}

/**
 * 登录页面
 */
@RouteView({
  condition: true
})
export default class LoginView extends React.Component<LoginViewProps, LoginViewState> {


  render(): React.ReactElement {
    return <div>
      登录
    </div>
  }
}
