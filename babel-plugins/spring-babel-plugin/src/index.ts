import {Program,} from "@babel/types";




export default function (babel) {


    const Program = {
        enter(path, state) {

        },
        exit() {

        }
    };

    const result = {
        visitor: {Program}
    };

    return result;
}
