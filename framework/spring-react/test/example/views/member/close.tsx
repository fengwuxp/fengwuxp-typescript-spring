import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface EditProps {

}

@RouteView({
    name: "用户禁用",
    pathname: "/member/close",
    condition: (context) => {

        return false;
    }
})
export default class CloseView extends React.Component<EditProps> {

}
