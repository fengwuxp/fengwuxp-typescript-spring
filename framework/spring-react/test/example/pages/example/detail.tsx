import * as React from "react";
import {RouteView, RouteViewOptions} from "fengwuxp-routing-core";


export interface DetailProps {

}

@RouteView<RouteViewOptions & {
    icon: any
}>({
    condition: "#member.add",
    icon: require("react")
})
export default class DetailView extends React.Component<DetailProps> {

}
