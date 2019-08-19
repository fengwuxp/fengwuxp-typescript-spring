import {RetentionPolicy} from "./RetentionPolicy";

/**
 * Indicates how long annotations with the annotated type are to
 * be retained.  If no Retention annotation is present on
 * an annotation type declaration, the retention policy defaults to
 * {@code RetentionPolicy.RUNTIME}.
 *
 * @param value
 * @constructor
 *
 * @Retention(RetentionPolicy.SOURCE)
 * @Target(ElementType.ANNOTATION_TYPE)
 */
export const Retention = (value?: RetentionPolicy) => {

};
