import {RouteViewEnhancer, RouteViewOptions} from "fengwuxp-routing-core";
import React, {useEffect, useState} from "react";
import {EventStateManagerHolder, Subscription} from "fengwuxp-event-state";


export interface ReactCmdDataProviderEnhancerProps {

    // 需要监听的全局状态事件
    globalEvents?: string[];
}


export type ReactCmdDataProviderRouteViewOptions = RouteViewOptions & {
    cmdDataProvider?: ReactCmdDataProviderEnhancerProps
};
/**
 * 用于增强视图 自动监听event state
 * @param ReactComponent
 * @param options
 * @constructor
 */
const ReactCmdDataProviderEnhancer: RouteViewEnhancer = (ReactComponent: any, options: ReactCmdDataProviderRouteViewOptions) => {

    return (props) => {

        const {cmdDataProvider} = options;

        // 当前页面状态
        const [eventState, updateEventState] = useState({});

        // 全局状态
        const [globalEventState, updateGlobalEventState] = useState({});

        useEffect(() => {
                const eventStateManager = EventStateManagerHolder.getManager();
                const pathname = location.pathname;
                // 监听当前路由事件
                const subscribers: Subscription[] = [eventStateManager.getEventState(pathname).subject(updateEventState)];
                if (cmdDataProvider && cmdDataProvider.globalEvents) {
                    // 监听全局事件
                    const globalEventSubjectSubscribers: Subscription[] = cmdDataProvider.globalEvents.map(eventName => {
                        return eventStateManager.getEventState(eventName).subject((globalProps) => {
                            // async mode use immer js
                            // @link https://github.com/immerjs/immer
                            import("immer").then(({produce}) => {
                                updateGlobalEventState(produce(globalEventState, draftState => {
                                    draftState[eventName] = globalProps;
                                }));
                            })
                        });
                    });
                    subscribers.push(...globalEventSubjectSubscribers);
                }

                return () => {
                    console.log(`取消订阅路由主题 pathname =${pathname}`);
                    subscribers.forEach(subscriptionHolder => {
                        subscriptionHolder.unsubscribe();
                    })
                }
            },
            //该effect只会执行一次
            []
        );


        return <ReactComponent {...props} {...eventState} {...globalEventState}/>;
    };

};

export default ReactCmdDataProviderEnhancer;
