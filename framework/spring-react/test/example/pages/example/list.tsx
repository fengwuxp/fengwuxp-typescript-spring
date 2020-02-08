import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


interface ListViewProps {

}


const ListView = (props: ListViewProps) => {
    return null;
};

export default RouteView({
    condition: "#member!=null"
})(ListView);
