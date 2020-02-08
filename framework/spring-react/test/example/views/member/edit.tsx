import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface EditProps {

}

@RouteView({
    name: "用户编辑",
    pathname: "member_edit",
    condition: (context) => {

        return false;
    }
})
export default class EditView extends React.Component<EditProps> {

}
