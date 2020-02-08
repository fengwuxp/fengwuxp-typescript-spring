import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface IndexViewProps {

}

@RouteView({
    condition: "member.add",
    exact: false,
    strict: false
})
export default class IndexView extends React.Component<IndexViewProps> {

}
