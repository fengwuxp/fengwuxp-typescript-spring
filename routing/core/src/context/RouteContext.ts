export interface RouteContext {

    pathname: string;

    uriVariables: Record<string, any>;

    state: Record<string, any>

}

export type RouteContextFactory<T extends RouteContext = RouteContext> = () => T;
