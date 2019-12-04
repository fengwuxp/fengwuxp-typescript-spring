/**
 * custom enum interface for java
 */
export interface Enum {
    /**
     * name
     */
    name: string;
    /**
     * index
     */
    ordinal: number;
    /**
     * desc
     */
    desc?: string;
    /**
     * extra prop
     */
    [extraProp: string]: any;
}
