/**
 * event names
 * key: state name
 * value: event name
 */
export interface GlobalEventNames {

    // [key:string]:string;
}

// export type PickEventTypeKey<EventType extends GlobalEventNames> = {
//     [P in keyof EventType]: keyof EventType;
// };
//
// export type PickEventTypeValue<EventType extends GlobalEventNames> = {};
//
//
//
// export const pickEventKeys = <EventType extends GlobalEventNames>(eventType: EventType): PickEventTypeKey<EventType> => {
//     return Object.keys(eventType)
//         .reduce((previousValue, currentValue) => {
//             previousValue[currentValue] = currentValue;
//             return previousValue;
//         }, {}) as any;
// };
