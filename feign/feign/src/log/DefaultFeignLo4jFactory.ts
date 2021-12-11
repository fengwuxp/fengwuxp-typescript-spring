import {FeignLog4jFactory} from "./FeignLog4jFactory";
import ConsoleLogger from "./ConsoleLogger";
import DelegateLog4jLogger from "./DelegateLog4jLogger";

const ROOT_LOGGER = new ConsoleLogger("root")
let defaultFeignLo4jFactory: FeignLog4jFactory = {
    getLogger: (category?: string) => new DelegateLog4jLogger(ROOT_LOGGER, category),
    getRootLogger: () => ROOT_LOGGER
};

export const setDefaultFeignLo4jFactory = (factory: FeignLog4jFactory) => {
    defaultFeignLo4jFactory = factory;
}

export default defaultFeignLo4jFactory;