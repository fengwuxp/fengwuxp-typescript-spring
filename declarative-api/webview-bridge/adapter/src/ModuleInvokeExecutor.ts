import {InvokeModuleMessage} from "./MessageStructure";

//

export interface ModuleInvokeExecutor {


    invoke: (message: InvokeModuleMessage) => Promise<any>;
}
