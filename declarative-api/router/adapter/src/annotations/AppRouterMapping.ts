import {RouterCommandConfiguration} from '../RouterCommandConfiguration';
import {AppCommandRouter} from "../AppCommandRouter";
import {appCommandRouterFactory} from '../AppCommandRouterFactory';
import {AUTHENTICATION_VIEWS} from "./RouteMapping";

export interface AppRouterMappingConfiguration extends Partial<RouterCommandConfiguration> {

    pathPrefix?: string;

    autoJoinQueryString?: boolean
}


/**
 * 默认会检查url是否需要登录
 * @param configuration
 * @constructor
 */
export const AppRouterMapping = <T>(configuration?: AppRouterMappingConfiguration): Function => {

    return (clazz: { new(...args: T[]): {} }): T & Partial<AppCommandRouter> => {

        const methodNameCommandResolver = configuration.methodNameCommandResolver == null ? null : configuration.methodNameCommandResolver();


        const pathPrefix = configuration.pathPrefix || '';
        // @ts-ignore
        return class extends clazz implements AppCommandRouter {
            constructor() {
                super();
                const transformMethodNameToPathname = (methodName) => {
                    const method = this[methodName];
                    let pathname = methodName;
                    if (method != null) {
                        pathname = method.pathname;
                    }
                    if (pathname == null) {
                        pathname = methodNameCommandResolver(methodName);
                    }
                    return pathname
                };

                const authenticationViews = AUTHENTICATION_VIEWS.map(item => `${pathPrefix}${transformMethodNameToPathname(item)}`);
                return appCommandRouterFactory({
                    authenticationViews: () => authenticationViews,
                    methodNameCommandResolver: () => transformMethodNameToPathname,
                    navigatorAdapter: configuration.navigatorAdapter,
                    navigatorContextAdapter: configuration.navigatorContextAdapter,
                    confirmBeforeJumping: configuration.confirmBeforeJumping == null ? configuration.confirmBeforeJumping : () => {
                        const confirmBeforeJumping = configuration.confirmBeforeJumping();
                        return (object) => {
                            const [path] = object.pathname.split("?");
                            const needAuthentication = authenticationViews.some(item => path.endsWith(item));
                            if (needAuthentication) {
                                // 需要登录
                                return confirmBeforeJumping(object)
                            }
                            return true;
                        }
                    }
                }, configuration.pathPrefix, configuration.autoJoinQueryString)
            }
        }
    }
};
