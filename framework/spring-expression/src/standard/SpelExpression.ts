import {Expression} from "../Expression";
import {EvaluationContext} from "../EvaluationContext";

export default class SpelExpression implements Expression {

    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    getExpressionString = () => {
        return this.expression.getExpressionString()
    };

    getValue = <T = any>(context?: EvaluationContext, rootObject?: object) => {
        return this.expression.getValue(context, rootObject);
    };

    isWritable = (context?: EvaluationContext, rootObject?: object) => {
        return this.expression.isWritable(context, rootObject);
    };

    setValue = (context: EvaluationContext, rootObject: object, value: any) => this.expression.setValue(context, rootObject, value);


}
