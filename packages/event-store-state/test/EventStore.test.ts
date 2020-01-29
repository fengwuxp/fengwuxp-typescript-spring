// import * as log4js from "log4js";
// import {EventState} from "../src/event/EventState";
// import {Subscription} from "../src/event/Subscription";
// import EventStoreHolder from "../src/EventStoreHolder";
// import {newProxyInstanceEnhance, ProxyScope} from "fengwuxp-common-proxy";
//
// const logger = log4js.getLogger();
// logger.level = 'debug';
//
//
// const mockEventSource = {
//
//     onChange: (handle: (event: any) => void) => {
//         handle("");
//     }
// }
//
// class MockEventStore implements EventState {
//
//     private eventDataStore: Map<any, any[]> = new Map<any, any[]>();
//
//     private eventHandles: Map<any, Function[]> = new Map<any, Function[]>();
//
//     private prevPathname: string = "";
//
//
//     constructor() {
//
//         mockEventSource.onChange((event) => {
//             this.removePreEventSate();
//             this.pushEventSate(event);
//             this.prevPathname = event;
//         })
//     }
//
//     close: () => void;
//     getEventName: () => string;
//
//
//
//     setState = (event: string, state: any, propKey?: string): Promise<void> => {
//         const eventDataStore = this.eventDataStore;
//         const anies = this.eventDataStore.get(event) || [];
//         const lastIndex = anies.length - 1;
//         const oldSate = anies[lastIndex] || {};
//         let newState = state;
//         if (propKey) {
//             oldSate[propKey] = state;
//             newState = oldSate;
//         }
//         anies[lastIndex] = newState;
//         eventDataStore.set(event, anies);
//         // 广播事件
//         const functions = this.eventHandles.get(event);
//         if (functions != null) {
//             functions.forEach((handle) => {
//                 handle(newState);
//             })
//         }
//
//         return Promise.resolve();
//     };
//
//     subject = (event: any, handle: (data: any) => void): Subscription => {
//
//         const eventHandles = this.eventHandles;
//         let functions = eventHandles.get(event);
//         if (functions == null) {
//             functions = [];
//             eventHandles.set(event, functions);
//         }
//         functions.push(handle);
//
//         const subscription = {
//             closed: false,
//             unsubscribe(): void {
//                 const handles = functions.filter(func => {
//                     return func !== handle;
//                 });
//                 eventHandles.set(event, handles);
//                 subscription.closed = true;
//             },
//             isClosed: () => {
//                 return subscription.closed;
//             }
//         };
//         return subscription
//     };
//
//     private removePreEventSate = () => {
//         const eventDataStore = this.eventDataStore;
//         const prevPathname = this.prevPathname;
//         const anies = eventDataStore.get(prevPathname);
//         if (anies != null && anies.length > 0) {
//             anies.pop();
//             eventDataStore.set(prevPathname, anies);
//         }
//     };
//
//     private pushEventSate = (event) => {
//         const eventDataStore = this.eventDataStore;
//         let anies = eventDataStore.get(event);
//         if (anies == null) {
//             anies = [];
//         }
//         anies.push({})
//
//     }
// }
//
// EventStoreHolder.setEventStore(new MockEventStore());
//
// interface DataProviderOptions {
//
//     eventName?: string;
// }
//
// const getCurrentEventName = () => {
//     return "test";
// }
//
// const DataProvider = (options: DataProviderOptions) => {
//     return (clazz: { new(...args: any[]): {} }): any => {
//
//         return class extends clazz {
//
//             constructor() {
//                 super();
//                 const eventStore = EventStoreHolder.getEventStore();
//
//                 return newProxyInstanceEnhance(this, (object: any, propertyKey: string, receiver: any) => {
//                     const currentEvent = getCurrentEventName();
//                     const eventState = eventStore.getState(currentEvent) || {};
//                     return async function (...args) {
//                         const oldFunction = object[propertyKey];
//                         const newState = await oldFunction(...args, eventState[propertyKey]);
//                         await eventStore.setState(currentEvent, newState, propertyKey);
//                         return newState;
//                     }
//                 }, null);
//             }
//         }
//     }
// };
//
// type UpdateStateMethod<T> = (inputState?: T, state?: T) => T | Promise<T>;
//
// @DataProvider({})
// class MockDataProvider {
//
//
//     userName: UpdateStateMethod<string> = (inputState, state: string) => {
//
//         return inputState;
//     };
//
//     goodsList = (state: any[] = []): Promise<any[]> => {
//
//         state.push(...[]);
//         return Promise.resolve(state);
//     }
//
// }
//
// const mockDataProvider = new MockDataProvider();
//
//
// describe("test event store", () => {
//
//     const eventStore = EventStoreHolder.getEventStore();
//     test("test event store stat", () => {
//
//         const subscriber = eventStore.subject(getCurrentEventName(), (data) => {
//             logger.debug("接收到事件", data)
//         });
//
//         mockDataProvider.userName("111");
//
//         // subscriber.unsubscribe();
//         mockDataProvider.userName("222");
//         logger.debug(subscriber.isClosed());
//         mockDataProvider.goodsList();
//     })
//
// });
//
