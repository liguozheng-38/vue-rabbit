# 小兔鲜电商前台

基于 Vue 3 + Vite + Pinia + Element Plus 的 B2C 电商前台应用，覆盖首页、分类、商品详情、购物车、结算、支付、会员中心等完整购物链路。

## 项目特性

### 架构与复用

- **Composables 逻辑复用**：将 `useCountDown`、`useBanner`、`useCategory` 等业务逻辑从组件中剥离，函数式组合，避免 mixin 命名冲突与来源不清
- **通用组件全局注册**：通过 `componentPlugin` 一次性注册 `XtxImageView`、`XtxSku`、`XtxBackTop` 等高频组件，跨页面直接使用
- **插槽驱动的容器组件**：`HomePanel` 通过具名插槽 `#main` 接入主体内容，新品、热销、推荐三处复用同一面板结构
- **纯展示组件**：`GoodsItem` 仅接收 props 渲染，首页、分类、二级分类列表共用

### SKU 规格选择

`src/components/XtxSku` 采用 **幂集 + 路径字典** 算法实现规格联动：

- `power-set.js` 用位运算枚举所有子集，复杂度 O(n·2ⁿ)，n ≤ 5
- `getPathMap` 预将有库存 SKU 的所有子集组合注册到哈希表
- 点击时用「已选项 + 当前按钮」组合查表，O(1) 判断禁用态
- 全选后通过组合 key 直接命中 skuId，回传价格与库存

### 状态管理

Pinia 三个 store 按业务域划分：

| Store           | 职责                              |
| --------------- | --------------------------------- |
| `userStore`     | 登录态、用户信息、Token、退出清理 |
| `cartStore`     | 购物车增删改、单选/全选、合计统计 |
| `categoryStore` | 顶部导航分类列表                  |

- `pinia-plugin-persistedstate` 持久化用户与购物车，刷新不丢
- 跨 store 调用：登录后自动合并本地购物车到后端
- Axios 拦截器统一注入 Token、处理 401 重定向

### 路由与导航

- **路由懒加载**：除 Layout / Home 外所有页面 `() => import(...)` 动态导入，首屏仅加载必要 chunk
- **`onBeforeRouteUpdate`**：分类页同组件复用场景下，监听路由参数变化重新请求数据，避免组件重建丢失状态
- **`scrollBehavior`**：路由切换自动回到顶部或锚点

### 性能优化

- **图片懒加载**：自定义 `v-img-lazy` 指令，基于 `IntersectionObserver` 进入视口才设置 src，加载后自动停止观察
- **骨架屏**：所有异步数据区域使用 `el-skeleton`，结构与真实内容一致，避免布局抖动
- **Element Plus 按需导入**：`unplugin-vue-components` + `ElementPlusResolver`，只打包用到的组件与样式
- **SCSS 变量主题**：通过 `additionalData` 注入全局变量，便于统一换肤

### 暗黑模式

基于 `@vueuse/core` 的 `useDark()` 实现：

- localStorage 自动持久化
- `<html>` class 自动切换
- 系统偏好 `prefers-color-scheme` 首次访问自动跟随
- 各组件配套 `html.dark` 样式覆盖

### 工程规范

- **ESLint + oxlint** 双重代码检查
- **Prettier** 统一格式化
- **Husky + Commitlint + Commitizen** 规范提交信息
- **Git Hooks**：pre-commit 自动 lint，commit-msg 校验类型

## 技术栈

| 分类     | 依赖                                                                    |
| -------- | ----------------------------------------------------------------------- |
| 核心框架 | Vue 3.5、Vite 7、Vue Router 5、Pinia 3                                  |
| UI 库    | Element Plus 2                                                          |
| 工具库   | Axios、Day.js、Sass、@vueuse/core                                       |
| 构建     | unplugin-auto-import、unplugin-vue-components、vite-plugin-vue-devtools |
| 持久化   | pinia-plugin-persistedstate                                             |
| 规范     | ESLint、oxlint、Prettier、Husky、Commitlint、Commitizen                 |

## 项目结构

```
rabbit/
├── public/                        # 静态资源
├── src/
│   ├── apis/                      # 接口模块（10 个业务域）
│   ├── assets/                    # 图片/图标资源
│   ├── components/                # 全局公共组件
│   │   ├── BackTop/               # 回到顶部
│   │   ├── ImageView/             # 图片放大镜
│   │   ├── XtxSku/                # SKU 规格选择器
│   │   │   ├── index.vue
│   │   │   └── power-set.js       # 幂集算法
│   │   └── index.js               # 全局注册插件
│   ├── composables/               # 组合式函数
│   │   └── useCountDown.js
│   ├── directives/                # 自定义指令（图片懒加载）
│   ├── router/                    # 路由配置
│   ├── stores/                    # Pinia 状态
│   │   ├── cartStore.js
│   │   ├── categoryStore.js
│   │   └── userStore.js
│   ├── styles/                    # 全局样式与变量
│   ├── utils/                     # HTTP 封装、地区数据
│   ├── views/                     # 页面
│   │   ├── Home/                  # 首页
│   │   ├── Category/              # 一级分类
│   │   │   └── composables/       # useBanner / useCategory
│   │   ├── SubCategory/           # 二级分类
│   │   ├── Detail/                # 商品详情
│   │   ├── CartList/              # 购物车
│   │   ├── Checkout/              # 结算
│   │   ├── Pay/                   # 支付
│   │   ├── Member/                # 会员中心
│   │   ├── Login/                 # 登录
│   │   └── Layout/                # 一级布局
│   ├── App.vue
│   └── main.js
├── vite.config.js                 # Vite 配置（代理 + 按需导入）
├── eslint.config.js
├── .prettierrc.json
├── .cz-config.cjs                 # Commitizen 类型配置
└── 接口文档.md
```

## 快速开始

### 环境要求

- Node.js `^20.19.0 || >=22.12.0`
- npm >= 8

### 安装与运行

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器（默认 http://localhost:5173）
npm run build      # 生产构建
npm run preview    # 预览生产构建
```

### 默认登录账号

登录页已预填测试账号，可直接点击登录：

- 账号：`heima282`
- 密码：`hm#qd@23!`

### 代码规范命令

```bash
npm run lint         # oxlint + eslint --fix
npm run format       # Prettier 格式化
npm run format:check # 检查格式
npm run commit       # 交互式生成规范提交
```

## 提交规范

使用 `npm run commit` 触发 Commitizen 交互式提交，格式：

```
<type>(<scope>): <subject>
```

**type**：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `chore` / `revert` / `build`

**scope**：`components` / `views` / `router` / `store` / `utils` / `api` / `styles` / `config` / `other`

示例：

```
feat(components): 新增 SKU 规格选择器

- 基于幂集算法预建路径字典
- 支持禁用态判断与库存匹配
```

## 配置说明

### Vite 代理

`vite.config.js` 中已配置 `/api` 代理到后端测试服务器，开发环境无需处理跨域：

```js
server: {
  proxy: {
    '/api': {
      target: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
```

### 路径别名

`@` 指向 `./src`，由 Vite `resolve.alias` 与 `jsconfig.json` 共同配置，支持 IDE 跳转。

## 浏览器支持

Chrome >= 90 / Firefox >= 88 / Safari >= 14 / Edge >= 90

## 推荐开发环境

[VS Code](https://code.visualstudio.com/) + 插件：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

浏览器装 [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 便于调试。

## 许可证

MIT
