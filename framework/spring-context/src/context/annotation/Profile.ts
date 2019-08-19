/**
 * Indicates that a component is eligible for registration when one or more
 * {@linkplain #value specified profiles} are active.
 *
 * @param values
 * @constructor
 *
 * @Retention(RetentionPolicy.SOURCE)
 * @Target(ElementType.TYPE,ElementType.METHOD)
 */
export const Profile = (...values: string[]) => {

};