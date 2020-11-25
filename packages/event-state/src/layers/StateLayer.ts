/**
 * state layer
 * <pre>
 *     <ExampleStateLayer>
 *         <Example/>
 *     </ExampleStateLayer>
 * </pre>
 */
export interface StateLayer<T> {

    init: () => Promise<T>;

    refresh: (newState: T) => Promise<void>;

    getState: () => T;
}