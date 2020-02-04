import {RouterCommandConfiguration} from '../RouterCommandConfiguration';
import {AppCommandRouter} from "../AppCommandRouter";
import {appCommandRouterFactory} from '../AppCommandRouterFactory';

export interface AppRouterMappingConfiguration extends Partial<RouterCommandConfiguration> {

    pathPrefix?: string;

    autoJoinQueryString?: boolean
}


/**
 *
 * @param configuration
 * @constructor
 */
export const AppRouterMapping = <T>(configuration?: AppRouterMappingConfiguration): Function => {

    return (clazz: { new(...args: T[]): {} }): T & Partial<AppCommandRouter> => {

        const methodNameCommandResolver = configuration.methodNameCommandResolver == null ? null : configuration.methodNameCommandResolver();
        // @ts-ignore
        return class extends clazz implements AppCommandRouter {
            constructor() {
                super();
                const that = this;
                return appCommandRouterFactory({
                    methodNameCommandResolver: () => {
                        return (methodName) => {
                            const method = that[methodName];
                            if (method == null) {
                                if (methodNameCommandResolver == null) {
                                    return methodName;
                                } else {
                                    return methodNameCommandResolver(methodName);
                                }
                            }
                            return method.pathname;
                        };
                    },
                    navigatorAdapter: configuration.navigatorAdapter,
                    navigatorContextAdapter: configuration.navigatorContextAdapter,
                    confirmBeforeJumping: configuration.confirmBeforeJumping
                }, configuration.pathPrefix, configuration.autoJoinQueryString)
            }
        }
    }
};
