<script setup>
import { getCheckoutInfoAPI, createOrderAPI } from '@/apis/checkout'
import { addAddressAPI, delAddressAPI } from '@/apis/address'
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/el-message-box.css'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { areaList } from '@/utils/areaData'
const router = useRouter()
const cartStore = useCartStore()
// 订单对象
const checkInfo = ref({})
// 地址对象
const curAddress = ref({})
// 加载状态
const loading = ref(true)

const handleCancelAdd = () => {
  addAddressDialog.value = false // 记得加 .value
  resetAddressForm()
}
const getCheckoutInfo = async () => {
  loading.value = true
  const res = await getCheckoutInfoAPI()
  checkInfo.value = res.result
  // 适配默认地址
  // 从地址列表中筛选出来 isDefault === 0 那一项
  curAddress.value = checkInfo.value.userAddresses.find(item => item.isDefault === 0)
  loading.value = false
}

// 简易删除地址（测试，直接删除确定的一个地址）
// const delAddress = async (id) => {
//   await delAddressAPI("2019292375095971841");
//   await getCheckoutInfo();
// };
// onMounted(() => delAddress());

// 控制弹窗打开
const showDialog = ref(false)
onMounted(() => {
  getCheckoutInfo()
})

// 切换地址
const activeAddress = ref({})
const switchAddress = item => {
  activeAddress.value = item
}

const confirm = () => {
  curAddress.value = activeAddress.value
  showDialog.value = false
  activeAddress.value = {}
}

const cancel = () => {
  showDialog.value = false
  activeAddress.value = {}
}

// 删除地址
const deleteAddress = async id => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await delAddressAPI(id)
    ElMessage.success('删除成功')
    await getCheckoutInfo()
    // 如果删除的是当前选中的地址，清空当前地址
    if (curAddress.value.id === id) {
      curAddress.value = {}
    }
  } catch (err) {
    ElMessage.info('已取消删除')
  }
}

//创建订单
const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    goods: checkInfo.value.goods.map(item => {
      return {
        skuId: item.skuId,
        count: item.count
      }
    }),
    addressId: curAddress.value.id
  })
  const orderId = res.result.id
  router.push({
    path: '/pay',
    query: {
      id: orderId
    }
  })
  // 更新购物车
  cartStore.updateNewList()
}

// 添加地址
// 省市区选择器绑定值（三级：[省编码, 市编码, 区编码]）
const cascaderValue = ref([])
// 省市区级联选择事件
const handleCascaderChange = selectedOptions => {
  if (cascaderValue.value.length === 3) {
    addressForm.value.provinceCode = cascaderValue.value[0]
    addressForm.value.cityCode = cascaderValue.value[1]
    addressForm.value.countyCode = cascaderValue.value[2]
    addressForm.value.fullLocation = selectedOptions.map(item => item.label).join(' ')
  }
}

const addAddressDialog = ref(false)
// 添加地址loading
const addAddressLoading = ref(false)

// 添加地址表单数据
const addressForm = ref({
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  address: '',
  postalCode: '',
  addressTags: '',
  isDefault: 1, // 0默认 1非默认
  fullLocation: ''
})
// 重置添加地址表单
const resetAddressForm = () => {
  addressForm.value = {
    receiver: '',
    contact: '',
    provinceCode: '',
    cityCode: '',
    countyCode: '',
    address: '',
    postalCode: '',
    addressTags: '',
    isDefault: 1,
    fullLocation: ''
  }
}

// 提交添加地址
const submitAddAddress = async () => {
  // 表单校验
  if (!addressForm.value.receiver || !addressForm.value.contact) {
    ElMessage.warning('请填写收货人姓名和联系方式')
    return
  }
  if (!addressForm.value.provinceCode) {
    ElMessage.warning('请选择省市区')
    return
  }
  if (!addressForm.value.address) {
    ElMessage.warning('请填写详细地址')
    return
  }

  addAddressLoading.value = true
  try {
    await addAddressAPI(addressForm.value)
    ElMessage.success('地址添加成功')
    addAddressDialog.value = false
    // 添加地址成功后重置添加地址表单
    resetAddressForm()
    // 重新拉取结算信息，更新地址列表
    await getCheckoutInfo()
  } catch (err) {
    ElMessage.error('地址添加失败')
  } finally {
    addAddressLoading.value = false
  }
}
</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="wrapper">
            <h3 class="box-title">收货地址</h3>
            <div class="box-body">
              <div class="address skeleton-address">
                <el-skeleton-item variant="text" style="width: 60%; height: 30px" />
              </div>
            </div>
            <h3 class="box-title">商品信息</h3>
            <div class="box-body">
              <div class="skeleton-goods">
                <div v-for="i in 3" :key="i" class="skeleton-item">
                  <el-skeleton-item variant="image" style="width: 70px; height: 70px" />
                  <el-skeleton-item variant="text" style="width: 200px; margin-left: 20px" />
                </div>
              </div>
            </div>
            <h3 class="box-title">金额明细</h3>
            <div class="box-body">
              <el-skeleton-item variant="text" style="width: 40%; height: 30px" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="wrapper">
            <!-- 收货地址 -->
            <h3 class="box-title">收货地址</h3>
            <div class="box-body">
              <div class="address">
                <div class="text">
                  <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
                  <ul v-else>
                    <li>
                      <span>收<i />货<i />人：</span>{{ curAddress.receiver }}
                    </li>
                    <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                    <li>
                      <span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}
                    </li>
                  </ul>
                </div>
                <div class="action">
                  <el-button size="large" @click="showDialog = true">切换地址</el-button>
                  <el-button size="large" @click="addAddressDialog = true">添加地址</el-button>
                </div>
              </div>
            </div>
            <!-- 商品信息 -->
            <h3 class="box-title">商品信息</h3>
            <div class="box-body">
              <table class="goods">
                <thead>
                  <tr>
                    <th width="520">商品信息</th>
                    <th width="170">单价</th>
                    <th width="170">数量</th>
                    <th width="170">小计</th>
                    <th width="170">实付</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in checkInfo.goods" :key="i.id">
                    <td>
                      <a href="javascript:;" class="info">
                        <img :src="i.picture" alt="" />
                        <div class="right">
                          <p>{{ i.name }}</p>
                          <p>{{ i.attrsText }}</p>
                        </div>
                      </a>
                    </td>
                    <td>&yen;{{ i.price }}</td>
                    <td>{{ i.price }}</td>
                    <td>&yen;{{ i.totalPrice }}</td>
                    <td>&yen;{{ i.totalPayPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 配送时间 -->
            <h3 class="box-title">配送时间</h3>
            <div class="box-body">
              <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
              <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
              <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
            </div>
            <!-- 支付方式 -->
            <h3 class="box-title">支付方式</h3>
            <div class="box-body">
              <a class="my-btn active" href="javascript:;">在线支付</a>
              <a class="my-btn" href="javascript:;">货到付款</a>
              <span style="color: #999">货到付款需付5元手续费</span>
            </div>
            <!-- 金额明细 -->
            <h3 class="box-title">金额明细</h3>
            <div class="box-body">
              <div class="total">
                <dl>
                  <dt>商品件数：</dt>
                  <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
                </dl>
                <dl>
                  <dt>商品总价：</dt>
                  <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
                </dl>
                <dl>
                  <dt>运<i></i>费：</dt>
                  <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
                </dl>
                <dl>
                  <dt>应付总额：</dt>
                  <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
                </dl>
              </div>
            </div>
            <!-- 提交订单 -->
            <div class="submit">
              <el-button type="primary" size="large" @click="createOrder">提交订单</el-button>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog title="切换收货地址" width="30%" center v-model="showDialog">
    <div class="addressWrapper">
      <div
        class="text item"
        :class="{ active: activeAddress.id === item.id }"
        v-for="item in checkInfo.userAddresses"
        :key="item.id"
      >
        <ul @click="switchAddress(item)">
          <li>
            <span>收<i />货<i />人：</span>{{ item.receiver }}
          </li>
          <li><span>联系方式：</span>{{ item.contact }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
        <span class="delete-btn" @click.stop="deleteAddress(item.id)">删除</span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 添加地址 -->
  <el-dialog title="添加收货地址" width="50%" center v-model="addAddressDialog">
    <div class="address-form">
      <el-form :model="addressForm" label-width="100px">
        <el-form-item label="收货人姓名">
          <el-input v-model="addressForm.receiver" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addressForm.contact" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="省市区">
          <el-cascader
            v-model="cascaderValue"
            :options="areaList"
            @change="handleCascaderChange"
            placeholder="请选择省市区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressForm.address" placeholder="请输入街道、门牌号等" />
        </el-form-item>
        <el-form-item label="邮政编码">
          <el-input v-model="addressForm.postalCode" placeholder="请输入邮编" />
        </el-form-item>
        <el-form-item label="地址标签">
          <el-input v-model="addressForm.addressTags" placeholder="多个标签用英文逗号分隔" />
        </el-form-item>
        <el-form-item label="是否默认地址">
          <el-radio-group v-model="addressForm.isDefault">
            <el-radio value="0">是</el-radio>
            <el-radio value="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancelAdd">取消</el-button>
        <el-button type="primary" @click="submitAddAddress" :loading="addAddressLoading">
          确认添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@use 'sass:color';

.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    > ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    > a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;
    justify-content: space-between;
    padding-right: 10px;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: color.adjust($xtxColor, $lightness: 50%);
    }

    > ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;
      flex: 1;
    }

    .delete-btn {
      color: #999;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 4px;
      background: #f5f5f5;

      &:hover {
        color: #fff;
        background: #f56c6c;
      }
    }
  }
}

// /* 基础样式补充 */
// .address-form {
//   padding: 10px 0;
// }
// .my-btn {
//   display: inline-block;
//   padding: 8px 16px;
//   margin-right: 10px;
//   border: 1px solid #e6e6e6;
//   border-radius: 4px;
//   cursor: pointer;
// }
// .my-btn.active {
//   background: #409eff;
//   color: #fff;
//   border-color: #409eff;
// }
// .addressWrapper .item {
//   padding: 10px;
//   border: 1px solid #e6e6e6;
//   border-radius: 4px;
//   margin-bottom: 10px;
//   cursor: pointer;
// }
// .addressWrapper .item.active {
//   border-color: #409eff;
//   background: #f5f9ff;
// }
</style>
