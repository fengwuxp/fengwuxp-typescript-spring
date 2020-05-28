import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";
import IndexView from "../index";


export interface ListViewProps {

}

@RouteView({

    parent: IndexView
})
export default class ListView extends React.Component<ListViewProps> {

}
