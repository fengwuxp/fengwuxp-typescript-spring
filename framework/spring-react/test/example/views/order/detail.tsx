import * as React from "react";
import {RouteView} from "fengwuxp-routing-core";


export interface DetailProps {

}

@RouteView({
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
