import * as React from "react";
import Loadable from 'react-loadable';

let Loading = null;


type ComponentFetcher = () => Promise<any>;

/**
 * 异步加载组件
 * @param component
 * @returns {React.ComponentType<T>}
 */
export default function AsyncLoading(component: ComponentFetcher): React.ComponentType {


    const C: React.ComponentType<any> = Loadable({
        loader: () => component(),
        loading: () => <Loading/>
    });


    class AsyncComponent extends React.Component<any, any> {
        render() {
            return C ? <C {...this.props}/> : null
        }
    }

    return AsyncComponent;
}

export function setDefaultLoadingComponent(componentLoading: any) {
    Loading = componentLoading
}


