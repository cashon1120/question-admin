import { Request, Response } from 'express';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/account_fetch': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: {
        list:[
          {name: '张三',phone: '13982193130', company:1, id: 1},
          {name: '李四',phone: '18113052120', company:2, id: 2}
        ]
      }
    });
  },
};
