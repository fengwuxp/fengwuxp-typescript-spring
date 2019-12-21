/**
 * invoke module message structure
 */
export interface InvokeModuleMessage {

    id: number;

    moduleName: string;

    memberName: string;

    args?: any[];
}

/**
 *  invoke result message structure
 */
export interface InvokeResultMessage {

    id: number;

    result?: any;

    // only promise reject
    error?: any
}
