import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


interface InputProps {

}

@RouteView({
    order: 2,
    condition: "#member.add"
})
export default class InputView extends React.Component<InputProps> {

}
