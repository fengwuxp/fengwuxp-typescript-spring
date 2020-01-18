import {AbstractAppCommandRouter, AppRouterMapping} from "fengwuxp-declarative-router-adapter";
import { getRouterCommandConfiguration } from './TarojsAppCommandRouterFactory';


/**
 * 抽象的tarojs命令路由器
 */
@AppRouterMapping({
    ...getRouterCommandConfiguration(undefined),
    pathPrefix: "/pages/"
})
export abstract class AbstractTarojsCommandRouter extends AbstractAppCommandRouter{

}
