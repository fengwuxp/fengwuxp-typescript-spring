import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";
import IndexView from "../index";


export interface InputProps {

}

@ReactViewMapping({
    condition:"member.add",
    parent: IndexView,

})
export default class InputView extends React.Component<InputProps> {

}
