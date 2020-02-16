import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface EditProps {

}

@RouteView({
    condition:(context)=>{

        return false;
    }
})
export default class EditView extends React.Component<EditProps> {

}
