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

    return (clazz: { new(...args: any[]): {} }): T & Partial<AppCommandRouter> => {

        // @ts-ignore
        return class extends clazz implements AppCommandRouter {
            constructor() {
                super();
                const that = this;
                return appCommandRouterFactory({
                    methodNameCommandResolver: () => {
                        return (methodName) => {
                            const method = that[methodName];
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
