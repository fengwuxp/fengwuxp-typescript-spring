import {MethodNameCommandResolver} from "fengwuxp-declarative-command";
import {NavigatorAdapter} from "./NavigatorAdapter";


export interface RouterCommandConfiguration {

    methodNameCommandResolver: () => MethodNameCommandResolver;

    navigatorAdapter: <E extends NavigatorAdapter = NavigatorAdapter> () => E;

}
