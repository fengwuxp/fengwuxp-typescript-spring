import {EventBroadcastAdapter} from "./EventBroadcastAdapter";
import {MethodNameCommandResolver} from "fengwuxp-declarative-command";

export interface BroadcastCommandConfiguration {

    broadcastAdapter: () => EventBroadcastAdapter;

    methodNameCommandResolver?: () => MethodNameCommandResolver;
}
