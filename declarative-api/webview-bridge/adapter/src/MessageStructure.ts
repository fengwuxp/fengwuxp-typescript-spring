/**
 * invoke module message structure
 */
export interface InvokeModuleMessage {

    id: number;

    moduleName: string;

    functionName: string;

    args?: any[];
}

/**
 *  invoke result message structure
 */
export interface InvokeResultMessage {

    id: string;

    result: any;

    // only promise reject
    error?: any
}
