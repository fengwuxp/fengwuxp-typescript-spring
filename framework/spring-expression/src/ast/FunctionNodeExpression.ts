import {Expression} from "../Expression";
import {EvaluationContext} from "../EvaluationContext";
import {ParserContext, TEMPLATE_EXPRESSION} from "../ParserContext";
import StringUtils from "fengwuxp-common-utils/lib/string/StringUtils";

const OPERATORS = [
    '+',
    '-',
    '*',
    '/',
    '%',
    '>',
    '<',
    '>=',
    '<=',
    '&',
    '|',
    '!',
    '&&',
    '||',
    '!!'
];

export default class FunctionNodeExpression implements Expression {

    private expressionString: string;

    private invokeFunction: Function;

    constructor(expressionString: string, parserContext?: ParserContext) {

        this.expressionString = expressionString;
        if (!parserContext.isTemplate()) {
            return;
        }

        const regExp = parserContext.getRegExp();


        this.invokeFunction = function (context?: EvaluationContext, rootObject?: object) {

            const code = expressionString.replace(regExp, (val) => {
                return this.converterFunctionNode(val, parserContext)(context);
            });

            return new Function(`return ${code}`)();

        }


    }

    getExpressionString = () => this.expressionString;

    getValue = <T = any>(context?: EvaluationContext, rootObject?: object) => {

        return this.invokeFunction(context, rootObject);
    };

    isWritable = (context?: EvaluationContext, rootObject?: object) => false;

    setValue = (context: EvaluationContext, rootObject: object, value: any) => undefined;


    private converterFunctionNode = (expression: string, context: ParserContext) => {
        const valueExpression = expression.replace(context.getExpressionPrefix(), "").replace(context.getExpressionSuffix(), "")
        const variableName = "context";
        const code = `  
             if(arguments.length===0){
               return;
             }
             var ${variableName}=arguments[0]
             return ${variableName}.${valueExpression}            
         `;
        return new Function(code);
    }

}
