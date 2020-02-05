import {Feign, FeignRequestOptions, GetMapping} from 'fengwuxp-typescript-feign';

import {PageInfo} from 'oak-common';
import {DemoItem} from '../../../mock/dmeo_table';

/**
 * 类：例子服务
 * */

@Feign({
  value: '/mock/',
})
class MockService {

  @GetMapping({
    value: '/menu/list',
  })
  getMenus: (req: any, option?: FeignRequestOptions) => Promise<Array<any>>;


  @GetMapping({
    value: '/demo/page',
  })
  queryDemoList: (req: any, option?: FeignRequestOptions) => Promise<PageInfo<DemoItem>>;
}

export default new MockService();
