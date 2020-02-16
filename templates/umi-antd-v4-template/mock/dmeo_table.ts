import {Request, Response} from 'express';
import {DemoItem, Sex} from "./model/DemoItem";


const total = 6000;
/**
 * 模拟演示数据
 * @param req
 * @param res
 */
const getDemoPages = (req: Request, res: Response) => {
  const items: DemoItem[] = [];
  console.log('req.query', req.query);
  const {querySize} = req.query;
  const {queryPage} = req.query;
  let i = 0;
  const
    begin = querySize * queryPage;
  while (i++ < querySize) {
    items.push({
      id: begin + i,
      name: `name${i}${begin}`,
      age: begin + i,
      birthday: new Date().getTime(),
      avatar: '',
      sex: i % 2 === 0 ? Sex.MAN : Sex.WOMAN,
    })
  }

  const result = {
    total,
    records: items,
    queryPage,
    querySize,
    queryType: 'QUERY_RESET',
  };

  res.json(result);
};

const demos = [];

const createDemo = (req: Request, res: Response) => {
  const body = req.body;
  console.log("==crate demo==>", body);
  demos.push([body]);
};


const editDemo = (req: Request, res: Response) => {
  const body = req.body;
  console.log("==crate demo==>", body);
  demos.push([body]);
};

const getDemo = (req: Request, res: Response) => {

  res.json({
    ...demos[0]
  });
};

export default {
  'GET /api/mock/demo/page': getDemoPages,
  'GET /api/mock/demo/create': createDemo,
  'GET /api/mock/demo/edit': editDemo,
  'GET /api/mock/demo/detail': getDemo,
};
