import {ExpressionParser} from "../ExpressionParser";
import {ParserContext, TEMPLATE_EXPRESSION} from "../ParserContext";
import SpelExpression from "./SpelExpression";
import ConstantExpression from "../ast/ConstantExpression";
import FunctionNodeExpression from "../ast/FunctionNodeExpression";
import {SpelParserConfiguration} from "../SpelParserConfiguration";


export default class InternalSpelExpressionParser implements ExpressionParser {

    private static VALID_QUALIFIED_ID_PATTERN = new RegExp('[\\p{L}\\p{N}_$]+');

    private configuration: SpelParserConfiguration;


    constructor(configuration?: SpelParserConfiguration) {
        this.configuration = configuration;
    }

    parseExpression = (expressionString: string, context: ParserContext = TEMPLATE_EXPRESSION): SpelExpression => {

        if (!this.isValidQualifiedId(expressionString) || context == null) {
            // not spel expression ,return function
            return new SpelExpression(new ConstantExpression(expressionString));
        }

        return new SpelExpression(new FunctionNodeExpression(expressionString, context));
    };

    private isValidQualifiedId = (expressionString: string): boolean => {


        return InternalSpelExpressionParser.VALID_QUALIFIED_ID_PATTERN.test(expressionString);
    }
}
