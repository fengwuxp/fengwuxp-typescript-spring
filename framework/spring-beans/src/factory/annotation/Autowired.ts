/**
 * Marks a constructor, field, setter method, or config method as to be autowired by Spring's dependency injection facilities
 *
 * @param options
 * @constructor
 */
export const Autowired = (options?: AutowiredOptions): Function => {

    return null;
};

export interface AutowiredOptions {

    /**
     * 类全路径名
     */
    className?: string;

}