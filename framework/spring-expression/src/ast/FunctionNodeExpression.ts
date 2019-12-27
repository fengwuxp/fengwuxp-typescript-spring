import {Expression} from "../Expression";
import {EvaluationContext} from "../EvaluationContext";
import {ParserContext, TEMPLATE_EXPRESSION} from "../ParserContext";
import {newProxyInstance, newProxyInstanceEnhance} from "fengwuxp-common-proxy";

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
                return this.converterFunctionNode(val, parserContext, context)(context);
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

    private converterFunctionNode = (expression: string, parserContext: ParserContext, evaluationContext: EvaluationContext) => {
        const valueExpression = expression.replace(parserContext.getExpressionPrefix(), "").replace(parserContext.getExpressionSuffix(), "");
        let keys = Object.keys(evaluationContext);
        let isArray = Array.isArray(evaluationContext);
        if (isArray) {
            keys = keys.map(key => `$${key}`);
        }
        const code = `  
             if(arguments.length===0){
               return;
             }              
             const args=arguments[0]
             if(${isArray}){
               const [${keys.join(",")}] = args;  
               return ${valueExpression}       
             }
                  
             const {${keys.join(",")}} = args;  
             return ${valueExpression}            
         `;
        return new Function(code)
    }


}
