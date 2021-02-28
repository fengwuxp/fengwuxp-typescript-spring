import * as React from "react";
import {ReactViewMapping} from "fengwuxp-spring-react/src/annotations/ReactViewMapping";


interface DetailProps {

}

@ReactViewMapping({
    condition:"member.add"
})
class DetailView extends React.Component<DetailProps> {


    constructor(props: DetailProps, context: any) {
        super(props, context);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return undefined;
    }
}
export default DetailView
