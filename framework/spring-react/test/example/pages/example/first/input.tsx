import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface InputProps {

}

@RouteView<& { hideInMenu: boolean }>({
    order: 2,
    condition: "#member.add",
    hideInMenu: true
})
export default class InputView extends React.Component<InputProps> {

}
