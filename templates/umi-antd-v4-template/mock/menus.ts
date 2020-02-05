import {Request, Response} from 'express';

/**
 * 模拟菜单数据
 * @param req
 * @param res
 */
const getMenus = (req: Request, res: Response) => {
  res.json([]);
};

export default {
  'GET /api/mock/menu/list': getMenus,
};
