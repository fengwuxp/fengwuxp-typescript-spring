import * as log4js from "log4js";
import {EventState} from "../src/event/EventState";
import {Subscription} from "../src/event/Subscription";
import {newProxyInstanceEnhance, ProxyScope} from "fengwuxp-common-proxy";
import {Subject} from "rxjs";
import EventStateManagerHolder from "../src/EventStateManagerHolder";
import CmdDataProvider from "../src/annotations/CmdDataProvider";
import {ApplicationEventType} from "../src/enums/ApplicationEventType";

const logger = log4js.getLogger();
logger.level = 'debug';


const mockEventSource = {

    onChange: (handle: (event: any) => void) => {
        handle("");
    }
}


interface DataProviderOptions {

    eventName?: string;
}

const getCurrentEventName = () => {
    return `${ApplicationEventType.GLOBAL}_test`;
}


type UpdateStateMethod<T> = (inputState?: T, state?: T) => T | Promise<T>;

CmdDataProvider.setEventNameGenerator(() => {
    return getCurrentEventName();
})

@CmdDataProvider()
class MockDataProvider {


    userName: UpdateStateMethod<string> = (inputState, state: string) => {

        return inputState;
    };

    goodsList = (state: any[] = []): Promise<any[]> => {

        state.push(...[]);
        return Promise.resolve(state);
    }

}

const mockDataProvider = new MockDataProvider();


describe("test rxjs event store", () => {

    const eventStateManager = EventStateManagerHolder.getManager();
    const eventState = eventStateManager.getEventState(getCurrentEventName());
    test("test rxjs event store stat", () => {

        const subscriber = eventState.subject((data) => {
            logger.debug("接收到事件", data)
        });

        mockDataProvider.userName("111");
        mockDataProvider.userName("222");
        logger.debug(subscriber.isClosed());
        mockDataProvider.goodsList();
        // subscriber.unsubscribe();
        logger.debug(subscriber.isClosed());
    })

});

