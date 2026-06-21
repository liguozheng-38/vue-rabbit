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
    { name: 'components', value: '组件相关' },
    { name: 'views', value: '视图相关' },
    { name: 'router', value: '路由相关' },
    { name: 'store', value: '状态管理' },
    { name: 'utils', value: '工具函数' },
    { name: 'api', value: '接口相关' },
    { name: 'styles', value: '样式相关' },
    { name: 'config', value: '配置相关' },
    { name: 'common', value: '公共通用' },
    { name: 'other', value: '其他' }
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
