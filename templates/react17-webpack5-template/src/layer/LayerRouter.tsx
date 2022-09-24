import {RouteConfig} from "react-router-config";
import * as ReactDOM from "react-dom";
import React from "react";


const renderLayer=()=>{

}

const openRouteView=(route:RouteConfig)=>{

    const mountedNode = document.createElement('div');
    document.body.appendChild(mountedNode);

    function mountedComponent(props: any) {

        ReactDOM.render(renderLayer(),  mountedNode);
    }

    function unmountedComponent(...args: any[]) {
        const unmountResult = ReactDOM.unmountComponentAtNode(mountedNode);
        if (unmountResult && mountedNode.parentNode) {
            mountedNode.parentNode.removeChild(mountedNode);
        }
    }
}




