import {ViewMapping} from "../../ViewMapping";


const View = () => {

};

const LookupView = ViewMapping({
    pathname: '/member/lookup'
})(View);

export default LookupView;
