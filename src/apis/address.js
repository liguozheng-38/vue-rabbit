import request from '@/utils/http'

// 添加地址
export const addAddressAPI = data => {
  return request({
    url: '/member/address',
    method: 'POST',
    data
  })
}

// 删除地址
export const delAddressAPI = id => {
  return request({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}
