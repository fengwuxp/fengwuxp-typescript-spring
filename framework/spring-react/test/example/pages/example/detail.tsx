import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


interface DetailProps {

}

@RouteView({
    condition: "#member.add"
})
export default class DetailView extends React.Component<DetailProps> {

}
