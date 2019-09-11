import { IConfig, IPlugin } from 'umi-types';

import defaultSettings from './defaultSettings';
// https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/login',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/login',
          component: './Login',
        },
      ],
    },
    {
      path: '/',
      Routes: ['src/pages/Authorized'],
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/',
          redirect: '/userInfo/list',
        },
        {
          path: '/userInfo/list',
          name: 'userInfo',
          icon: 'idcard',
          hideChildrenInMenu: true,
          routes: [
            {
              path: '/userInfo/list',
              name: 'list',
              component: './UserInfo/List'
            },
          ]
        },
        {
          path: '/userInfo/detail/:id',
          name: 'userInfoDetail',
          component: './UserInfo/Detail',
          hideInMenu: true,
        },
        {
          path:'/report',
          name: 'report',
          icon: 'profile',
          component: './Report/List'
        },
        {
          path: '/question',
          name: 'question',
          icon: 'file-unknown',
          authority: ['admin'],
          routes: [
            {
              path: '/question/list',
              name: 'list',
              component: './Question/List',
            },
            {
              path: '/question/add',
              name: 'add',
              component: './Question/Add',
            },
            {
              path: '/question/detail/:id?',
              name: 'detail',
              component: './Question/Add',
              hideInMenu: true
            },
          ],
        },
        {
          path: '/qcode',
          name: 'qcode',
          icon: 'code',
          // authority: ['admin'],
          routes: [
            {
              path: '/qcode/enroll',
              name: 'enroll',
              component: './Qcode/Enroll',
            },
            {
              path: '/qcode/Examination',
              name: 'examination',
              component: './Qcode/Examination',
            },
            {
              path: '/qcode/:type',
              name: 'qcodeType',
              component: './Qcode/Index',
              hideInMenu: true
            },
          ],
        },
        {
          path: '/account',
          name: 'account',
          icon: 'team',
          // authority: ['admin'],
          component: './Account/Index'
        },
        {
          path: '/empty',
          name: 'empty',
          hideInMenu: true,
          component: './Empty'
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,

  proxy: {
    '/api/': {
      target: 'https://juneee.cn',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
} as IConfig;
