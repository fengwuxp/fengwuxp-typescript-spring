import {Expression} from "../Expression";
import {EvaluationContext} from "../EvaluationContext";

/**
 * constant expression node
 */
export default class ConstantExpression implements Expression {

    private expressionString: string;

    private invokeFunction: Function;

    constructor(expressionString: string) {
        this.expressionString = expressionString;
        this.invokeFunction = new Function(`return ${expressionString}`);
    }

    getExpressionString = () => {
        return this.expressionString;
    };

    getValue = <T = any>(context?: EvaluationContext, rootObject?: object) => {
        return this.invokeFunction();
    };

    isWritable = (context?: EvaluationContext, rootObject?: object) => false;

    setValue = (context: EvaluationContext, rootObject: object, value: any) => undefined;


}
