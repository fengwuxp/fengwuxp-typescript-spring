import { Request, Response } from 'express';

export enum Sex {

  MAN,
  WOMAN
}

export interface DemoItem {

  id: number;

  name: string;

  age: number;

  birthday: Date | number;

  avatar: string;

  sex: Sex;
}

const total = 6000;
/**
 * 模拟演示数据
 * @param req
 * @param res
 */
const getDemoPages = (req: Request, res: Response) => {
  const items: DemoItem[] = [];
  console.log('req.query', req.query);
  const { querySize } = req.query;
  const { queryPage } = req.query;
  let i = 0; const
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

export default {
  'GET /api/demo/page': getDemoPages,
};
