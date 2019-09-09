import { Request, Response } from 'express';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/question_fetch': (req: Request, res: Response) => {
    res.send({
      success: true,
      data: {
        list:[
          {title: '张三',sex: '男', id: 1},
          {title: '李四',sex: '女', id: 2}
        ]
      }
    });
  },
};
