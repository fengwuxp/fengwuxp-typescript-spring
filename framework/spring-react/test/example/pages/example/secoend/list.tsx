import * as React from "react";
import {RouteView, RouteViewOptions} from "fengwuxp-routing-core";


export interface ListViewProps {

}


const ListView = (props: ListViewProps) => {
    return null;
};

export default RouteView<RouteViewOptions>({
    order:1,
    condition: "#member!=null"
})(ListView);
