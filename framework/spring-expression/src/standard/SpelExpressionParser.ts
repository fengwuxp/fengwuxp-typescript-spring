import {ExpressionParser} from "../ExpressionParser";
import {ParserContext} from "../ParserContext";
import InternalSpelExpressionParser from "./InternalSpelExpressionParser";
import SpelExpression from "./SpelExpression";

/**
 *  Hand-written SpEL parser. Instances are reusable but are not thread-safe.
 */
export default class SpelExpressionParser implements ExpressionParser {

    private internalSpelExpressionParser: InternalSpelExpressionParser;

    constructor(configuration?) {
        this.internalSpelExpressionParser = new InternalSpelExpressionParser(configuration);
    }

    parseExpression = (expressionString: string, context?: ParserContext): SpelExpression => {
        return this.internalSpelExpressionParser.parseExpression(expressionString, context);
    };


    parseRaw = (expressionString: string): SpelExpression => {
        return this.parseExpression(expressionString);
    };


}
