import * as React from "react";
import {RouteView, RouteViewOptions, ViewShowMode} from "fengwuxp-routing-core";


export interface DashBoardProps {

}

@RouteView<RouteViewOptions & {
    icon: any,
    pageHeader: any
}>({
    showMode: ViewShowMode.DIALOG,
    pageHeader: {
        title: "标题",
        content: 'example 创建',
    },
    condition: "#member.add",
    icon: require("react")
})
export default class DashBoard extends React.Component<DashBoardProps> {

}
