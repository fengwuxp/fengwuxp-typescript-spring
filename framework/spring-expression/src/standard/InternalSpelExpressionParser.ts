import {ExpressionParser} from "../ExpressionParser";
import {ParserContext, TEMPLATE_EXPRESSION} from "../ParserContext";
import SpelExpression from "./SpelExpression";
import FunctionNodeExpression from "../ast/FunctionNodeExpression";
import ConstantExpression from "../ast/ConstantExpression";


export default class InternalSpelExpressionParser implements ExpressionParser {

    // private static VALID_QUALIFIED_ID_PATTERN = new RegExp('[\\p{L}\\p{N}_$]+');

    // private configuration: SpelParserConfiguration;


    constructor(configuration?) {
        // this.configuration = configuration;
    }

    parseExpression = (expressionString: string, context: ParserContext = TEMPLATE_EXPRESSION): SpelExpression => {

        // if (!this.isValidQualifiedId(expressionString) || context == null) {
        //     // not spel expression ,return function
        //     return new SpelExpression(new ConstantExpression(expressionString));
        // }

        if (expressionString.indexOf(context.getExpressionPrefix()) < 0) {
            // 常量表达式
            return new SpelExpression(new ConstantExpression(expressionString));
        }

        return new SpelExpression(new FunctionNodeExpression(expressionString, context));
    };

    // private isValidQualifiedId = (expressionString: string): boolean => {
    //
    //
    //     return InternalSpelExpressionParser.VALID_QUALIFIED_ID_PATTERN.test(expressionString);
    // }
}
