import request from '@/utils/http'
/**
 * 获取结算信息
 */

// 获取详情接口
export const getCheckoutInfoAPI = () => {
  return request({
    url: '/member/order/pre'
  })
}

// 生成订单接口
export const createOrderAPI = data => {
  return request({
    url: '/member/order',
    method: 'POST',
    data
  })
}
