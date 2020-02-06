import {RouteViewEnhancer, RouteViewOptions} from "fengwuxp-routing-core";
import React, {useEffect, useState} from "react";
import {EventState, EventStateManagerHolder, Subscription} from "fengwuxp-event-state";


export interface ReactCmdDataProviderEnhancerProps {

    // 需要监听的全局状态事件
    globalEvents?: string[];
    // 安全模式，默认false
    safeMode?: boolean;
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

        const [isInit, setInit] = useState(false);

        // 全局状态
        const [globalEventState, updateGlobalEventState] = useState({});

        useEffect(() => {
                const eventStateManager = EventStateManagerHolder.getManager();
                const pathname = location.pathname;
                const subscribers: Subscription[] = [];
                // 监听当前路由事件
                let isUnsubscribe = false;
                const invoker = async () => {
                    const routeEventState: EventState = await eventStateManager.getEventState(pathname);
                    if (!isUnsubscribe) {
                        updateEventState(routeEventState.getState);
                        subscribers.push(routeEventState.subject(updateEventState));
                    }
                    if (cmdDataProvider && cmdDataProvider.globalEvents) {
                        // 监听全局事件
                        for (const globalEventName of cmdDataProvider.globalEvents) {
                            if (!isUnsubscribe) {
                                const rxGlobalEventState: EventState = await eventStateManager.getEventState(globalEventName);
                                const anies = {
                                    ...globalEventState,
                                    [globalEventName]: rxGlobalEventState.getState()
                                };
                                updateGlobalEventState(anies);
                                console.log("--rxGlobalEventState-->", anies, globalEventName, rxGlobalEventState);
                                const subscription = rxGlobalEventState.subject((globalProps) => {
                                    // async mode use immer js
                                    // @link https://github.com/immerjs/immer
                                    import("immer").then(({produce}) => {
                                        updateGlobalEventState(produce(globalEventState, draftState => {
                                            draftState[globalEventName] = globalProps;
                                        }));
                                    })
                                });
                                subscribers.push(subscription)
                            }
                        }
                        setInit(true);
                    } else {
                        setInit(true);
                    }
                };
                invoker().catch(console.log);

                return () => {
                    isUnsubscribe = true;
                    console.log(`取消订阅路由主题 pathname =${pathname}`);
                    subscribers.forEach(subscriptionHolder => {
                        subscriptionHolder.unsubscribe();
                    })
                }
            },
            //该effect只会执行一次
            []);

        if (!isInit && (cmdDataProvider == null || cmdDataProvider.safeMode != false)) {
            // 未初始化返回null
            return null;
        }

        return <ReactComponent {...props} {...eventState} {...globalEventState}/>;
    };

};

export default ReactCmdDataProviderEnhancer;
