import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";
import IndexView from "../index";


export interface EditProps {

}

@ReactViewMapping({
    condition:(context)=>{

        return false;
    },
    parent: IndexView
})
export default class EditView extends React.Component<EditProps> {

}
