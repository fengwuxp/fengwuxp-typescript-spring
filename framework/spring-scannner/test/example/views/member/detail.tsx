import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";


export interface DetailProps {

    name: string;
}

@ReactViewMapping({
    condition: "member.add"
})
class DetailView extends React.Component<DetailProps> {

}

const xxx = 1;

export default DetailView
