import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";
import IndexView from "../index";


export interface EditProps {

}

@RouteView({
    condition:(context)=>{

        return false;
    },
    parent: IndexView
})
export default class EditView extends React.Component<EditProps> {

}
