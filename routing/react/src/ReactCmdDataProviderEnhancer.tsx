import {RouteContextHolder, RouteViewOptions} from "fengwuxp-routing-core";
import React, {useEffect, useState} from "react";
import {EventState, EventStateManagerHolder, Subscription} from "fengwuxp-event-state";
import {GlobalEventNames} from "./GlobalEventNames";


type EventNameMapPropsNameResult<PropsType> = Partial<PropsType>


type MapEventNameToPropNameFactory<PropsType,
    GlobalPropType> = (globalPropNames: GlobalPropType) => EventNameMapPropsNameResult<PropsType>;

export interface ReactCmdDataProviderEnhancerProps<PropsType, GlobalPropType> {

    /**
     * 需要监听的全局状态事件
     * 返回结果：{
     *     propName:EVENT_NAME
     * }
     */
    propMapEventName?: MapEventNameToPropNameFactory<PropsType, GlobalPropType>;

    // 安全模式，默认:true
    safeMode?: boolean;
}


export type ReactCmdDataProviderRouteViewOptions<PropsType, GlobalProps> = RouteViewOptions & {
    cmdDataProvider?: ReactCmdDataProviderEnhancerProps<PropsType, GlobalProps>
};

export type GlobalEventNameType<GlobalPropType, GlobalEventType> = {

    [key in keyof GlobalPropType]: GlobalEventType[keyof GlobalEventType]
}

export interface ReactCmdDataProviderEnhancerType {

    (ReactComponent: any, options: ReactCmdDataProviderRouteViewOptions<any, any>): any;

    registerGlobalEventNames: <GlobalPropType, GlobalEventTyp>(globalNames: GlobalEventNameType<GlobalPropType, GlobalEventTyp>) => ReactCmdDataProviderEnhancerType;
}

// 事件名称
let globalEventNames: { [key: string]: string } = {};


/**
 * 用于增强视图 自动监听event state
 * 自动将url 参数注入 props
 * @param ReactComponent
 * @param options
 * @constructor
 */
const ReactCmdDataProviderEnhancer: ReactCmdDataProviderEnhancerType = (ReactComponent: any, options: ReactCmdDataProviderRouteViewOptions<any, any>) => {
    const {cmdDataProvider: cmdDataOptions = {safeMode: true}} = options;
    return (props) => {

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
                    if (cmdDataOptions.propMapEventName) {
                        // 监听全局事件
                        const propMapEventName = cmdDataOptions.propMapEventName(globalEventNames);
                        for (const propName of Object.keys(propMapEventName)) {
                            const globalEventName = propMapEventName[propName];
                            if (!isUnsubscribe) {
                                const rxGlobalEventState: EventState = await eventStateManager.getEventState(globalEventName);
                                const anies = {
                                    ...globalEventState,
                                    [propName]: rxGlobalEventState.getState()
                                };
                                updateGlobalEventState(anies);
                                console.log("--rxGlobalEventState-->", anies, globalEventName, rxGlobalEventState);
                                const subscription = rxGlobalEventState.subject((globalProps) => {
                                    // async mode use immer js
                                    // @link https://github.com/immerjs/immer
                                    import("immer").then(({produce}) => {
                                        updateGlobalEventState(produce(globalEventState, draftState => {
                                            draftState[propName] = globalProps;
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

        if (!isInit && cmdDataOptions.safeMode !== false) {
            // 未初始化且启用安全模式返回null
            return null;
        }

        const routeContext = RouteContextHolder.getRouteContext();

        return <ReactComponent {...props} {...eventState} {...globalEventState} {...routeContext.uriVariables}/>;
    };

};

ReactCmdDataProviderEnhancer.registerGlobalEventNames = (propMapEventNames: GlobalEventNames) => {
    globalEventNames = propMapEventNames as any;
    return ReactCmdDataProviderEnhancer;
};

export default ReactCmdDataProviderEnhancer;
