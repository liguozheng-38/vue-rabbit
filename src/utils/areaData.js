// 添加地址功能
// 简化版省市区数据，实际需用完整编码库
export const areaList = [
  {
    value: '110000',
    label: '北京市',
    children: [
      {
        value: '110100',
        label: '北京市',
        children: [
          { value: '110101', label: '东城区' },
          { value: '110102', label: '西城区' }
        ]
      }
    ]
  },
  {
    value: '210000',
    label: '辽宁省',
    children: [
      {
        value: '210200',
        label: '大连市',
        children: [
          { value: '210202', label: '中山区' },
          { value: '210203', label: '西岗区' }
        ]
      }
    ]
  }
]
