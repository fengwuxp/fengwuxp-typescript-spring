import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";


export interface IndexViewProps {

}

@ReactViewMapping({
    condition: "member.add",
    exact: false,
    strict: false
})
export default class IndexView extends React.Component<IndexViewProps> {

}
