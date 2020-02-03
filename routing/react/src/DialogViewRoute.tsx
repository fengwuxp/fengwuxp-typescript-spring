import React from "react";


export interface DialogViewRouteType {

    setDialogViewRender: (render: DialogViewRender) => void;
}

export type DialogViewRender = (props) => React.ReactElement;

let dialogViewRender: DialogViewRender = (props): React.ReactElement => {

    return <>{props.children}</>;
};

/**
 * 弹出路由视图
 * @param props
 * @constructor
 */
const DialogViewRoute: React.FunctionComponent & DialogViewRouteType = (props) => {

    return dialogViewRender(props);
};

DialogViewRoute.setDialogViewRender = (render: DialogViewRender) => {
    dialogViewRender = render;
};

export default DialogViewRoute;
