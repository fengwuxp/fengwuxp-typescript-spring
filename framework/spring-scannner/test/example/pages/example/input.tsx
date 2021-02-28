import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";


interface InputProps {

}

@ReactViewMapping({
    condition:"member.add"
})
export default class InputView extends React.Component<InputProps> {

}