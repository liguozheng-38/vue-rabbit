module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:     新功能'
    },
    {
      value: 'fix',
      name: 'fix:      修复bug'
    },
    {
      value: 'docs',
      name: 'docs:     文档更新'
    },
    {
      value: 'style',
      name: 'style:    代码格式(不影响代码运行的变动)'
    },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加功能，也不是修复bug)'
    },
    {
      value: 'perf',
      name: 'perf:     性能优化'
    },
    {
      value: 'test',
      name: 'test:     增加测试'
    },
    {
      value: 'chore',
      name: 'chore:    构建过程或辅助工具的变动'
    },
    {
      value: 'revert',
      name: 'revert:   回退'
    },
    {
      value: 'build',
      name: 'build:    打包'
    }
  ],
  scopes: [
    { value: 'components', name: 'components: 组件相关' },
    { value: 'views', name: 'views: 视图相关' },
    { value: 'router', name: 'router: 路由相关' },
    { value: 'store', name: 'store: 状态管理' },
    { value: 'utils', name: 'utils: 工具函数' },
    { value: 'api', name: 'api: 接口相关' },
    { value: 'styles', name: 'styles: 样式相关' },
    { value: 'config', name: 'config: 配置相关' },
    { value: 'common', name: 'common: 公共通用' },
    { value: 'other', name: 'other: 其他' }
  ],
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',
  messages: {
    type: '选择提交类型:',
    scope: '选择一个scope (可选):',
    customScope: '请输入自定义的scope:',
    subject: '简短描述(必填):',
    body: '详细描述，使用"|"换行(可选):\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如:#31, #34(可选):\n',
    confirmCommit: '确认提交说明?'
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],
  subjectLimit: 100
}
