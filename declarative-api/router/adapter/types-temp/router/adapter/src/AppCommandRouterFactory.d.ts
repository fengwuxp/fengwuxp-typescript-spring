import { AppCommandRouter } from "./AppCommandRouter";
import { NavigatorAdapter } from "./NavigatorAdapter";
import { RouterCommandConfiguration } from "./RouterCommandConfiguration";
/**
 * app command router factory
 *
 * @param configuration
 * @param pathPrefix   automatically supplemented prefix
 */
export declare const appCommandRouterFactory: <T extends AppCommandRouter, N extends NavigatorAdapter<import("./NavigatorAdapter").NavigatorDescriptorObject> = NavigatorAdapter<import("./NavigatorAdapter").NavigatorDescriptorObject>>(configuration: RouterCommandConfiguration, pathPrefix?: string) => T & N;
