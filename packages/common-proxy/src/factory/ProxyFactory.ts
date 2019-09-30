import {ProxyCreateConfig} from "../ProxyCreateConfig";

export interface ProxyFactory {

    factory: <T extends any = object>(config: ProxyCreateConfig<T>) => T;
}
