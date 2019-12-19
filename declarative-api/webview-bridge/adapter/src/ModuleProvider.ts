

/**
 * register open capability
 */
export interface ModuleProvider {

    /**
     * register module
     * @param module
     */
    registerModule: (module: OpenModuleInterface) => void;

    /**
     * get invoke method
     * @param module
     * @param methodName
     */
    getInvokeMethod:(module:string,methodName:string)=>Function;

}

export interface OpenModuleInterface {
    [key: string]: Function
}
