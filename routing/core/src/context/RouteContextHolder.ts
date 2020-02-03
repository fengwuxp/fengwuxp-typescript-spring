import {RouteContext, RouteContextFactory} from "./RouteContext";


export default class RouteContextHolder {

    private static ROUTE_CONTEXT_FACTORY: RouteContextFactory;

    public static getRouteContext = <T extends RouteContext>() => {

        return RouteContextHolder.ROUTE_CONTEXT_FACTORY();
    };

    public static setRouteContextFactory = (factory: RouteContextFactory) => {
        RouteContextHolder.ROUTE_CONTEXT_FACTORY = factory;
    }
}
