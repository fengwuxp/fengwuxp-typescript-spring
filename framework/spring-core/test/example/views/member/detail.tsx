import {ViewMapping} from "../../ViewMapping";


export interface DetailProps {

    name: string;
}

function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
@ViewMapping({
    pathname: "/member/detail"
})
class DetailView {

}

const xxx = 1;

export default DetailView
