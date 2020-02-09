import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";
import IndexView from "../index";


export interface InputProps {

}

@RouteView({
    condition: "member.add",
    parent: "/index",

})
export default class InputView extends React.Component<InputProps> {

}
