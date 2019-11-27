import {NavigatorContextAdapter} from "./NavigatorContextAdapter";
import {NavigatorDescriptorObject} from "./NavigatorAdapter";
import {RouteUriVariable} from "./AppCommandRouter";
import {parse} from "querystring";
import {RouterCommand} from "./RouterCommand";


export default class DefaultWrapperNavigatorContextAdapter<T extends NavigatorDescriptorObject = NavigatorDescriptorObject>
    implements NavigatorContextAdapter<T> {

    private browseHistory: T[] = [];


    getBrowseHistory = () => [...this.browseHistory];

    getCurrentObject = () => {
        const browseHistory = this.browseHistory;
        const length = browseHistory.length;
        return browseHistory[length - 1];
    };

    getCurrentPathname = () => this.getCurrentObject().pathname.split("?")[0];

    getCurrentState = <S = RouteUriVariable>() => this.getCurrentObject().state;

    getCurrentUriVariables = <S = RouteUriVariable>() => {
        const {pathname, uriVariables} = this.getCurrentObject();
        const [_, queryString] = pathname.split("?");
        return {
            ...(uriVariables as any),
            ...parse(queryString)
        }
    };

    isStackTop = () => this.browseHistory.length === 1;

    isView = (pathname: string) => this.getCurrentObject().pathname === pathname;

    operateBrowseHistory = (routerCommand: RouterCommand, navigatorDescriptorObject?: T) => {
        if ([RouterCommand.PUSH, RouterCommand.TO].indexOf(routerCommand) >= 0) {
            this.browseHistory.push(navigatorDescriptorObject);
            return;
        }

        if (RouterCommand.POP === routerCommand) {
            this.browseHistory.pop();
            return;
        }

        if ([RouterCommand.RESET, RouterCommand.POP_TO_TOP].indexOf(routerCommand) >= 0) {
            this.browseHistory = [];
            this.operateBrowseHistory(RouterCommand.PUSH, navigatorDescriptorObject);
            return;
        }

        if ([RouterCommand.REPLACE, RouterCommand.POP_AND_PUSH].indexOf(routerCommand) >= 0) {
            this.operateBrowseHistory(RouterCommand.POP);
            this.operateBrowseHistory(RouterCommand.PUSH, navigatorDescriptorObject);
            return;
        }

    };
}
