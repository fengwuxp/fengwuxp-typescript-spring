import {LogLevel} from './LogLevel';

/**
 * The org.slf4j.Logger interface is the main user entry point of SLF4J API.
 * It is expected that logging takes place through concrete implementations
 * of this interface.
 * <p/>
 * <h3>Typical usage pattern:</h3>
 * <pre>
 *
 */
export interface Logger {

    /**
     * Return the name of this <code>Logger</code> instance.
     * @return name of this logger instance
     */
    getName: () => string;

    getLevel: () => LogLevel;
    setLevel: (level: LogLevel) => void;

    /**
     * Is the logger instance enabled for the TRACE level?
     *
     * @return True if this Logger is enabled for the TRACE level,
     *         false otherwise.
     * @since 1.0.0
     */
    isTraceEnabled: () => boolean;

    /**
     * Log a message at the TRACE level according to the specified format
     * and arguments.
     * <p/>
     * <p>This form avoids superfluous object creation when the logger
     * is disabled for the TRACE level. </p>
     *
     * @param format the format string
     * @param args  a list of 3 or more arguments
     * @since 1.0.0
     */
    trace: (format: string, ...args: any[]) => void;


    /**
     * Is the logger instance enabled for the DEBUG level?
     *
     * @return True if this Logger is enabled for the DEBUG level,
     *         false otherwise.
     */
    isDebugEnabled: () => boolean;

    /**
     * Log a message at the DEBUG level according to the specified format
     * and arguments.
     * <p/>
     * <p>This form avoids superfluous string concatenation when the logger
     * is disabled for the DEBUG level. However, this variant incurs the hidden
     * (and relatively small) cost of creating an <code>Object[]</code> before invoking the method,
     * even if this logger is disabled for DEBUG. The variants taking
     * {@link #debug(string, any) one} and {@link #debug(string, any, any) two}
     * arguments exist solely in order to avoid this hidden cost.</p>
     *
     * @param format the format string
     * @param args  a list of 3 or more arguments
     * @since 1.0.0
     */
    debug: (format: string, ...args: any[]) => void;


    /**
     * Is the logger instance enabled for the INFO level?
     *
     * @return True if this Logger is enabled for the INFO level,
     *         false otherwise.
     */
    isInfoEnabled: () => boolean;

    /**
     * Log an exception (throwable) at the INFO level with an
     * accompanying message.
     *
     * @param format the format string
     * @param args  a list of 3 or more arguments
     * @since 1.0.0
     */
    info: (format: string, ...args: any[]) => void;

    /**
     * Is the logger instance enabled for the WARN level?
     *
     * @return True if this Logger is enabled for the WARN level,
     *         false otherwise.
     */
    isWarnEnabled: () => boolean;

    /**
     * This method is similar to {@link #warn(String, Object...)}
     * method except that the marker data is also taken into
     * consideration.
     *
     * @param format the format string
     * @param args  a list of 3 or more arguments
     * @since 1.0.0
     */
    warn: (format: string, ...args: any[]) => void;

    /**
     * Is the logger instance enabled for the ERROR level?
     *
     * @return True if this Logger is enabled for the ERROR level,
     *         false otherwise.
     */
    isErrorEnabled: () => boolean;

    /**
     * Log a message at the ERROR level according to the specified format
     * and arguments.
     * <p/>
     * <p>This form avoids superfluous string concatenation when the logger
     * is disabled for the ERROR level. However, this variant incurs the hidden
     * (and relatively small) cost of creating an <code>Object[]</code> before invoking the method,
     * even if this logger is disabled for ERROR. The variants taking
     * {@link #error(String, Object) one} and {@link #error(String, Object, Object) two}
     * arguments exist solely in order to avoid this hidden cost.</p>
     *
     * @param format the format string
     * @param args  a list of 3 or more arguments
     * @since 1.0.0
     */
    error: (format: string, ...args: any[]) => void;
}
