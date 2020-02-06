import * as log4js from "log4js";
import EventStateManagerHolder from "../src/EventStateManagerHolder";
import CmdDataProvider from "../src/annotations/CmdDataProvider";
import {ApplicationEventType} from "../src/enums/ApplicationEventType";
import CmdProviderMethod from "../src/annotations/CmdProviderMethod";
import produce from "immer"
import {StateProvider} from "../src";

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
};


type UpdateStateMethod<T> = (inputState?: T, state?: T) => T | Promise<T>;

CmdDataProvider.setEventNameGenerator(() => {
    return getCurrentEventName();
});

@CmdDataProvider()
class MockDataProvider implements StateProvider {

    defaultState = () => {

        return Promise.resolve({
            mock: 1
        });
    };

    userName: UpdateStateMethod<string> = (inputState, state: string) => {

        return inputState;
    };

    goodsList = (state: any[] = []): Promise<any[]> => {

        state.push(...[]);
        return Promise.resolve(state);
    };

    @CmdProviderMethod({
        propName: "userInfo"
    })
    login = (userName: string, password: string) => {

        return Promise.resolve({
            userName
        });
    };

    @CmdProviderMethod({
        ignore: true
    })
    mockMethod() {
        this.userName("123");
        this.goodsList(["1"]);
        this.login("1891821", "123456")
    }

}

const mockDataProvider = new MockDataProvider();


describe("test rxjs event store", () => {

    const sleep = (times) => {
        return new Promise((resolve) => {
            setTimeout(resolve, times)
        })
    };

    const eventStateManager = EventStateManagerHolder.getManager();

    test("test rxjs event store stat", async () => {
        const eventState = await eventStateManager.getEventState(getCurrentEventName());
        const subscriber = eventState.subject((data) => {
            logger.debug("接收到事件1", data)
        });
        const subscriber2 = eventState.subject((data) => {
            logger.error("接收到事件2", data)
        });
        mockDataProvider.mockMethod();
        await sleep(55);
        subscriber2.unsubscribe();
        mockDataProvider.userName("111");
        mockDataProvider.userName("222");
        logger.debug(subscriber.isClosed());
        mockDataProvider.goodsList();
        await sleep(55);
        subscriber.unsubscribe();
        mockDataProvider.goodsList();
        logger.debug(subscriber.isClosed());

    }, 10 * 100);


    test("test immer js", () => {
        const baseState = [
            {
                todo: "Learn typescript",
                done: true
            },
            {
                todo: "Try immer",
                done: false
            }
        ]

        const nextState = produce(baseState, draftState => {
            draftState.push({
                todo: "Tweet about it",
                done: false
            })
            draftState[1].done = true
        });


        logger.debug("nextState", nextState);
    })

});

