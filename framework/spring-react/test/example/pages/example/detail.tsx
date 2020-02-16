import * as React from "react";
import {RouteView, RouteViewOptions} from "fengwuxp-routing-core";


export interface DetailProps {

}

@RouteView<RouteViewOptions & {
    icon: any,
    pageHeader: any
}>({
    pageHeader: {
        title: "标题",
        content: 'example 创建',
    },
    condition: "#member.add",
    icon: require("react")
})
export default class DetailView extends React.Component<DetailProps> {

}
