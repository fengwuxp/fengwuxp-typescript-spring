import {ElementType} from "./ElementType";

/**
 * Indicates the contexts in which an annotation type is applicable. The
 * declaration contexts and type contexts in which an annotation type may be
 * applicable are specified in JLS 9.6.4.1, and denoted in source code by enum
 * constants of {@link ElementType ./ElementType}.
 *
 * @param value
 * @constructor
 *
 * @Retention(RetentionPolicy.SOURCE)
 * @Target(ElementType.ANNOTATION_TYPE)
 */
export const Target = (...value: ElementType[]) => {

};

