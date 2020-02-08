import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface DetailProps {

    name: string;
}

@RouteView({
    condition: "member.add"
})
class DetailView extends React.Component<DetailProps> {

}

const xxx = 1;

export default DetailView
