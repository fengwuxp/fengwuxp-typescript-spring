import * as log4js from "log4js";
import * as path from "path";
import * as fs from "fs";
import {helper} from './helper';
import {Get, Res, Component, Inject, DependencyRegistry} from 'loon';

const logger = log4js.getLogger();
logger.level = 'debug';


@Component()
class InjectableComponent {
    tag() {
        return 'injectable';
    }
}

@Component()
class UsersController {

    @Inject()
    private component: InjectableComponent;

    // @Get('/')
    // indexAction(@Res() res) {
    //     res.send(this.component.tag());
    // }
}

describe('test loon  ', () => {

    test('should inject a component', async t => {
        const instance = DependencyRegistry.components.get(UsersController);
        const klass = instance.klass;
        logger.debug(typeof klass['component'])
        logger.debug(typeof instance["tag"])

        // const response = await helper.getAxios().get('/');
        // logger.debug(response)
    });
});


