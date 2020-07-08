import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";
import IndexView from "@pages/index";


export interface DetailProps {

}

@RouteView({
    condition: "member.add",
    parent: IndexView
})
export default class CloseGoodsView extends React.Component<DetailProps> {

}
