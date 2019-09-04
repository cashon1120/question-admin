import { Request, Response } from 'express';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/userlogin': (req: Request, res: Response) => {
    const { code, userName, type } = req.body;
    if (code === '123' && userName === 'admin') {
      res.send({
        success: true,
        type,
        msg: '登录成功',
      });
      return;
    }
    res.send({
      success: false,
      type,
      msg: '账号或密码错误',
    });
  },
};
