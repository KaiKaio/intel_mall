<template>
	<!-- 商品支付页 -->
	<view class="app-init order-detail">
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="bottom">
			<view class="coupon-list">
				<view class="coupon" v-for="(coupon, cIndex) in couponList" :key="cIndex" :class="{'m-t-10' : cIndex != 0, 'coupon-border' : coupon.isUse}">
					<view class="coupon-left">
						<text class="color-hdsh">{{'单次消费满' + coupon.kw4 + '元' + (coupon.kw0 == '1' ? ('可打' + coupon.kw1 + '折') : ('减' + coupon.kw1 + '元'))}}</text>
						<text>店铺优惠券（{{coupon.kw6 == '0' ? '可与活动叠加' : '不可与活动叠加'}}）</text>
						<text>部分商品可用</text>
						<text>{{coupon.stime + ' 至 ' + coupon.etime}}</text>
					</view>
					<view class="tear-line"></view>
					<view class="coupon-right">
						<text v-if="coupon.canUse && coupon.isUse" @click="useCoupon(coupon,cIndex)">已使用</text>
						<text v-if="coupon.canUse && !coupon.isUse" @click="useCoupon(coupon,cIndex)">待使用</text>
						<text v-if="!coupon.canUse" style="color: #000; border-color: #000">未达要求</text>
					</view>
				</view>

				<view class="alarm">
					* <text>运费不参与优惠券价格计算</text>
				</view>
			</view>
			<!-- </view> -->
		</uni-popup>
		<view class="shop-pay">

			<ul class="address-sec" v-if="addre_list.length == 0" style="margin-top: 0;">
				<li id="address-btn" class="address-btn" @click="toAddressList('pay')">
					<span><i class="iconfont icon-bianji"></i>新建收货地址</span>
					<i class="iconfont icon-youbian"></i>
				</li>
			</ul>
			<view class="address" v-else-if="!isSL" @click="toAddressList('pay')" style="margin-top: 0;">
				<h3>收货人：{{default_addre.name}}<text>{{default_addre.phone}}</text></h3>
				<p class="detail">收货地址：{{default_addre.prov+default_addre.city+default_addre.area}}
					{{default_addre.address}}</p>
			</view>
			<view class="self-lifting-wrap" v-if="get_pay_data.kw10 == 1 && addre_list.length != 0">
				<view class="title">
					<text>线下自提</text>
					<view class="kg" :class="{ac:isSL}" @click="isSL ? isSL=false : isSL=true">
						<view class="yuan"></view>
					</view>
				</view>
				<view class="content" v-if="isSL">
					<text>{{default_addre.name + "  " + default_addre.phone}}</text>
					<text>请选择自提点</text>
					<radio-group @change="changeSL" class="sl-radio">
						<label class="radio item" v-for="(item,index) in SLPoint" :key="index">
							<radio :value="item.value" :checked="index === current" color="#00a0ea" />
							<text>{{item.name}}</text>
						</label>
					</radio-group>

				</view>
			</view>

			<h2 class="name">{{get_pay_data.kw0}}</h2>
			<!-- 预览 -->
			<ul class="list-product">
				<li>
					<a href="javascript:history.back()">
						<img class="list-pro-img fl" :src="order_photo" alt="" />
						<view class="list-pro-text fr">
							<h2>{{get_pay_data.name}}</h2>
							<view class="list-pro-price">
								<p>规格：{{get_pay_data.sku_cont}}</p>
								<span class="origin-price" v-if="get_pay_data.price != get_pay_data.origin_price && actCoupon.kw6 != '1'">¥{{get_pay_data.origin_price+'/'+get_pay_data.kw7}}</span>
								<span>¥{{actCoupon.kw6 != '1' ? get_pay_data.price : get_pay_data.origin_price}}/{{get_pay_data.kw7}}</span>
							</view>
						</view>
					</a>
					<view class="shop-num">
						×{{shop_num}}
					</view>
				</li>
			</ul>
			<view v-if="get_pay_data.coupon.length > 0" class="is-coupon" @click="openCouponPopup">
				<text v-if="actCoupon == ''">您有优惠券可使用，请点此选择</text>
				<text v-if="actCoupon.kw0 == '1'">{{'满' + actCoupon.kw4 + '元打' + actCoupon.kw1 + '折'}}</text>
				<text v-if="actCoupon.kw0 == '2'">{{'满' + actCoupon.kw4 + '元减' + actCoupon.kw1 + '元'}}</text>
			</view>

			<view class="discount-wrap" v-if="get_pay_data.act_choosed == 'none' && actCoupon != ''">
				<view v-if="get_pay_data.act_choosed != 'none' &&( actCoupon == '' || (actCoupon != '' && actCoupon.kw6 != '1'))"
				 class="item">
					<text>活动：</text>
					<text v-if="get_pay_data.act_choosed.kw0 == '1'">{{get_pay_data.act_choosed.kw1 + '折'}}</text>
					<!-- <text v-if="get_pay_data.act_choosed.kw0 == '2'">{{'-' + get_pay_data.act_choosed.kw1 + '元'}}</text> -->
					<text v-if="get_pay_data.act_choosed.kw0 == '2'">{{'-' + get_pay_data.act_choosed.kw2 + '元'}}</text>
				</view>
				<view v-if="actCoupon != ''" class="item">
					<text>优惠券：</text>
					<text v-if="actCoupon.kw0 == '1'">{{actCoupon.kw1 + '折'}}</text>
					<text v-if="actCoupon.kw0 == '2'">{{'-' + actCoupon.kw1 + '元'}}</text>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="choose-payment">
			<!-- <view class="pay" @click="changePayment('sc')">
				<text class="font-icon icon-wx">&#xe7b0;</text>
				<view class="weixin"><span>智慧卡支付</span>
				</view>
				<text class="font-icon fr" v-if="payment == 'sc'">&#xe622;</text>
			</view> -->
			<view class="pay" @click="changePayment('wx')">
				<text class="font-icon icon-wx">&#xe7b0;</text>
				<view class="weixin"><span>微信支付</span>
				</view>
				<text class="font-icon fr" v-if="payment == 'wx'">&#xe622;</text>
			</view>
			<view class="pay pay-sub" @click="changePayment('ali')">
				<text class="font-icon icon-alipay">&#xe660;</text>
				<view class="weixin"><span>支付宝</span>
				</view>
				<text class="font-icon fr" v-if="payment == 'ali'">&#xe622;</text>
			</view>
		</view>
		<!-- #endif -->

		<!-- #ifdef H5 || MP-WEIXIN -->
		<view class="pay">
			<text class="font-icon" @click="changePayment('wx')">&#xe7b0;</text>
			<view class="weixin"><span>微信支付</span><em>推荐</em></view>
			<text class="font-icon fr" v-if="payment == 'wx'">&#xe622;</text>
		</view>
		<!-- <view class="pay" @click="changePayment('sc')">
			<text class="font-icon icon-wx">&#xe7b0;</text>
			<view class="weixin"><span>智慧卡支付</span>
			</view>
			<text class="font-icon fr" v-if="payment == 'sc'">&#xe622;</text>
		</view> -->
		<!-- #endif -->

		<view class="paymoney" v-if="isFreight">
			<view class="money">
				实付款<span>¥{{amount}}</span>
				<span v-if="freight > 0 && !isSL" class="sec">{{'运费'+freight+'元'}}</span>
				<span v-else class="sec">免运费</span>
			</view>
			<view class="pay-btn bg-hdsh" @click="paySubmit">立即支付</view>
			<!-- <view class="pay-btn" @click="pay">立即支付</view> -->
		</view>
		<view class="paymoney" v-else>
			<view class="money">
				超出配送范围或无收货地址
			</view>
			<view class="pay-btn pay-unbtn">无法下单</view>
			<!-- <view class="pay-btn" @click="pay">立即支付</view> -->
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				shop_num: '', //商品数量
				order_num: '', //支付订单id
				order_id: '', //业务订单id
				default_photo: require("@/static/icon/default.png"),
				order_photo: '', //订单图片
				addre_list: [], //地址列表
				default_addre: {}, //默认收货地址
				default_addre_index: '', //默认收货地址的下标
				payment: 'wx',
				payChoice: "微信",
				// cardId: '2081110000100122824', //智慧卡卡号
				// pwd: '111111', //智慧卡密码
				isFreight: false, //是否在寄送范围内
				price: 0, //商品价
				freight: 0, //运费
				amount: 0, //总价
				freightMode: '', //运费模板
				isSL: false, //是否自提
				// SLPoint:[], //清溪商城配置
				SLPoint: [{
					value: '海岛生活商城总部（海垦国际金融中心）',
					name: '海岛生活商城总部（海垦国际金融中心）'
				}, {
					value: '石山火山风情旅游小镇旅游服务中心',
					name: '石山火山风情旅游小镇旅游服务中心'
				}, {
					value: '文昌东郊互联网农业小镇服务中心',
					name: '文昌东郊互联网农业小镇服务中心'
				}], //自提点，海岛生活配置
				current: 0, //自提点的下标
				timeAfter: 0, //防抖
				timeNow: 0, //防抖
				couponList: [], //可选的优惠券列表
				actCoupon: '', //被选中的优惠券
			};
		},
		computed: {
			...mapGetters(['get_pay_data', 'get_address_data'])
		},
		watch: {
			// 监听支付标识
			payment() {
				if (this.payment == 'wx') {
					this.payChoice = "微信"
				}
				if (this.payment == 'ali') {
					this.payChoice = "支付宝"
				}
				// if (this.payment == 'sc') {
				// 	this.payChoice = "智慧卡"
				// }
			},
			// 监听自提状态
			isSL() {
				this.amount = this.countPrice()
			}
		},
		onLoad() {
			this.couponList = this.get_pay_data.coupon
			this.couponList.forEach(item => {
				item.isUse = false
			})
			this.order_photo = this.get_pay_data.sku_photo == '' ? this.default_photo : this.$base.urlPrex + this.get_pay_data.sku_photo
			this.shop_num = this.get_pay_data.shop_num
		},
		onShow() {
			//查收货地址
			this.default_addre = {}
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then((resData) => {
				if (resData.data == null) {
					uni.showToast({
						icon: "none",
						mask: false,
						title: "账号信息有误，请联系至微信留言",
						duration: 1000
					})
				} else {
					let res = this.$base.strResToJson(resData.data).address
					// console.log(this.$base.strResToJson(resData.data))
					if (res == "" || res == "[]" || res == null) {
						//没有收货地址
						this.addre_list = []
					} else {
						//有
						this.addre_list = res
						if (this.get_address_data.changeIndex) {
							this.default_addre = this.addre_list[this.get_address_data.changeIndex]

						} else {
							for (let i = 0; i < this.addre_list.length; i++) {
								if (this.addre_list[i].isDefault == true) {
									this.default_addre_index = i
									this.default_addre = this.addre_list[i]
								}
							}
						}

						if (this.get_pay_data.freight_id != "") {
							this.$base.szblGet("/api/scgetfreight", {
								"m": this.$DEVELOPER.szblid,
								"tk": this.$DEVELOPER.token,
								"state": this.$base.getState(),
								"freightid": this.get_pay_data.freight_id,
								"areacode": this.default_addre.areacode
							}).then((res) => {
								// console.log(res)
								if (res.data != 'null') {
									let r = this.$base.strResToJson(res.data)
									if (r.kw0 != "2") {
										this.isFreight = true
									} else {
										this.isFreight = false
									}
									this.freightMode = r
									// console.log(r)
								}
								this.amount = this.countPrice()
							}).catch((msg) => {
								console.log(msg)
								return
							})
						}
						// console.log(this.default_addre)
					}
					this.$store.commit('set_address_data', this.addre_list)
				}
			}).catch((msg) => {
				console.log(msg)
			})

			this.checkCouponCanUse()
		},
		methods: {
			// 修改自提点
			changeSL(evt) {
				for (let i = 0; i < this.SLPoint.length; i++) {
					if (this.SLPoint[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			// 跳转至收货地址列表
			toAddressList(mark) {
				if (this.isSL) {
					return
				}
				uni.navigateTo({
					url: '/pages/component/addressList/addressList?m=' + mark,
				});
			},
			// 修改支付标识
			changePayment(mark) {
				this.payment = mark
			},
			//计算总价
			countPrice() {
				let amount = 0
				if (this.actCoupon != '') {
					let price = 0
					if (this.actCoupon.kw6 == '0') { // 叠加
						price = parseFloat(this.$base.numberFormat(this.get_pay_data.price * this.shop_num, 2, '.'))
					} else if (this.actCoupon.kw6 == '1') { //不叠加
						price = parseFloat(this.$base.numberFormat(this.get_pay_data.origin_price * this.shop_num, 2, '.'))
					}
					let discount = parseFloat(this.actCoupon.kw1) //折扣或减价
					if (this.actCoupon.kw0 == '1') { //折扣
						this.price = parseFloat(this.$base.numberFormat(price * discount / 10, 2, '.'))
					} else if (this.actCoupon.kw0 == '2') { //减价
						console.log(price - discount);
						this.price = parseFloat(this.$base.numberFormat(price - discount, 2, '.'))
					}
				} else {
					this.price = parseFloat(this.$base.numberFormat(this.get_pay_data.price * this.shop_num, 2, '.')) // 商品总价
				}
				// 每次商品总价变动后都要检查一次优惠券能不能用
				this.checkCouponCanUse()
				// console.log(this.price);
				if (this.isFreight && !this.isSL) {
					// 计算运费
					let baseNum = parseInt(this.freightMode.kw5) //基础数量
					if (this.shop_num <= baseNum) {
						this.freight = parseInt(this.freightMode.kw1)
						// amount = this.price + this.freight
						amount = this.$base.numberFormat(this.price + this.freight, 2, '.')
						console.log(amount);
					} else {
						let addNum = parseInt(this.freightMode.kw6) //增加的数量
						let addFreight = parseInt(this.freightMode.kw2) //超过基础数量后每增加addNum数量时增加的运费
						// this.freight = parseInt(this.freightMode.kw1) + Math.floor((this.shop_num - baseNum) / addNum) * addFreight
						this.freight = parseFloat(this.$base.numberFormat(parseInt(this.freightMode.kw1) + parseFloat(this.$base.numberFormat(
							(this.shop_num - baseNum) / addNum, 2, '.')) * addFreight, 2, '.'))
						console.log(this.freight)
						amount = this.$base.numberFormat(this.price + this.freight, 2, '.')
						// this.amount = this.price + parseInt(this.freightMode.kw1) - 
					}
				} else {
					// 免运费
					amount = this.$base.numberFormat(this.price, 2, '.')
					// console.log(amount);
				}

				return amount
			},
			/**
			 * 支付方法
			 * @param {String} orderid 实际支付订单
			 */
			payUp(orderid) {
				// uni.showLoading({
				// 	mask: false
				// })
				if (this.payment == 'ali') {
					// APP调起支付宝支付
					this.$base.szblGet("/api/alipayApp/" + orderid, {
						alisid: this.$DEVELOPER.aliPayMark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then((dataJson) => {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: dataJson.data, //微信、支付宝订单数据
							success: (res) => {
								// console.log('success:' + JSON.stringify(res));
								this.paySuccess();
								uni.hideToast();
								uni.showToast({
									title: '订单支付成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							},
							fail: (err) => {
								// console.log('fail:' + JSON.stringify(err));
								uni.hideToast();
								if (err.errMsg == 'requestPayment:fail:[payment支付宝:62001]用户中途取消支付操作') {
									uni.redirectTo({
										url: '/pages/order/orderShop/orderShop?type=0',
										success: res => {},
										fail: () => {},
										complete: () => {}
									});
								} else {
									uni.showToast({
										title: '订单支付失败',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								}
							}
						});
					}).catch((msg) => {
						console.log(msg);
					})
				} else if (this.payment == 'wx') {
					// app调起微信支付
					let mark = ''
					if (this.$TERMINAL.m == 'nmy') {
						// 农民云调起微信支付
						mark = this.$DEVELOPER.nmyPayMarkApp
					} else {
						mark = this.$DEVELOPER.wxPayMarkAPP
					}
					uni.showLoading({
						mask: false
					})
					this.$base.szblGet("/api/wechatpayApp/" + orderid, {
						wxsid: mark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then(dataJson => {
						uni.hideLoading()
						this.$PAYSUCCMSG.length = 0
						let obj = {
							phones: this.get_pay_data.kw1,
							cn_1: this.get_pay_data.store_name,
							cn_2: "新加",
							cn_3: this.default_addre.name + "购买了" + this.get_pay_data.name.replace(/【/g, " ").replace(/】/g, " "),
							order_id: this.order_id
						}
						this.$PAYSUCCMSG.push(obj)
						if (this.$TERMINAL.os == 'i') {
							window.webkit.messageHandlers.iosWechatPay.postMessage({
								body: JSON.parse(dataJson.data)
							});
						} else if (this.$TERMINAL.os == 'a') {
							window.android.androidWechatPay(dataJson.data)
						} else {
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: JSON.parse(dataJson.data), //微信、支付宝订单数据
								success: (res) => {
									// console.log('success:' + JSON.stringify(res));
									this.paySuccess();
									uni.hideToast();
									uni.showToast({
										title: '订单支付成功',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								},
								fail: (err) => {
									// console.log('fail:' + JSON.stringify(err));
									uni.hideToast();
									uni.redirectTo({
										url: '/pages/order/orderShop/orderShop?type=0',
										success: res => {},
										fail: () => {},
										complete: () => {}
									});
									uni.showToast({
										title: '订单支付失败',
										icon: 'none',
										mask: false,
										duration: 1000
									});
								}
							});
						}
					}).catch((msg) => {
						uni.hideLoading()
						console.log(msg);
					})
				} else if (this.payment == 'sc') {
					// app调起智慧卡支付
					this.$base.szblPost('/api/iccard/0009?m=' + this.$DEVELOPER.szblid + '&tk=' + this.$DEVELOPER.token + '&state=' +
						this.$base.getState() + '&rpflag=' + this.$DEVELOPER.rpflag + '&cardId=' + this.cardId + '&pwd=' + this.pwd +
						'&wxaliumsOrderId=' + orderid).then((res) => {
							uni.hideToast();
							let resData = this.$base.strResToJson(res.data)
							// console.log(resData)
							if (resData.postScript == '承兑或交易处理成功') {
								uni.redirectTo({
									url: '/pages/order/orderShop/orderShop?type=all',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}

						}).catch((msg) => {
						uni.hideToast();
						// uni.showToast({
						// 	icon: "none",
						// 	mask: false,
						// 	title: "卡号或密码错误",
						// 	duration: 1000
						// })
						console.log(msg)
					})
				}
			},
			// 支付成功后通知商家
			paySuccess() {
				let obj = {
					"phones": this.get_pay_data.kw1,
					"cn_1": this.get_pay_data.store_name,
					"cn_2": "新加",
					"cn_3": this.default_addre.name + "购买了" + this.get_pay_data.name.replace(/【/g, " ").replace(/】/g, " "),
				}
				this.$base.paySuccess(0, this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.szblid, this.order_id, obj.phones,
					obj.cn_1, obj.cn_2, obj.cn_3)
			},
			// 下单并调起支付
			paySubmit() {
				let _this = this
				let delayTime = 1500
				this.timeNow = Date.now()
				if (this.timeNow - this.timeAfter >= 1500) {
					this.timeAfter = this.timeNow
				} else {
					uni.showToast({
						mask: false,
						title: '请勿重复下单',
						duration: 1000,
						icon: "none"
					})
					return
				}
				// console.log(uni.getStorageSync("openid"));
				// #ifdef H5
				// var ua = window.navigator.userAgent.toLowerCase();
				// if (ua.match(/MicroMessenger/i) != 'micromessenger' && this.payment == 'wx') {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		mask: false,
				// 		title: '请关注“海岛生活”微信公众号打开',
				// 		duration: 1000
				// 	})
				// 	return false;
				// }
				// #endif
				//添加订单
				function wechatPay() {
					// #ifdef H5
					uni.showToast({
						title: '',
						icon: 'loading',
						mask: true,
						duration: 2000
					});
					// 微信H5支付
					_this.$base.getWxPay(_this.$userMsg.userid, _this.$userMsg.token, _this.order_num, _this.$DEVELOPER.wxPayMarkPUBLIC,
						uni.getStorageSync("wxOpenid")).then((res) => {
						//支付成功
						// if (res == "ok") {
						_this.paySuccess();
						// }
					}).catch((msg) => {
						console.log(msg);
						if (msg == "微信id错误，请重新打开本页") {
							uni.showToast({
								icon: "none",
								mask: true,
								duration: 1500,
								title: "支付失败，请重新打开，至订单列表支付"
							})
						} else {
							//跳转至个人中心
							uni.reLaunch({
								url: '/pages/tabBar/member/member'
							})
						}
					});
					// #endif

					// #ifdef MP-WEIXIN
					// 微信小程序支付
					_this.$base.getWxxcxPay(_this.$userMsg.userid, _this.$userMsg.token, _this.order_num, _this.$DEVELOPER.wxPayMarkXCX,
						uni.getStorageSync("wxXCXOpenid")).then((res) => {
						// console.log(res)
						uni.requestPayment({
							provider: "wxpay",
							timeStamp: res.timeStamp.toString(),
							nonceStr: res.nonceStr,
							package: res.package,
							signType: res.signType,
							paySign: res.paySign,
							success: (resData) => {
								// console.log(resData)
								_this.paySuccess()
							}
						})
					}).catch((msg) => {
						console.log(msg)
					})
					// #endif

				}
				if (JSON.stringify(this.default_addre) == "{}" && !this.isSL) {
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '请填写收货信息',
						duration: 1500
					})
					return false;
				}
				if (this.order_num) {
					// #ifdef H5 || MP-WEIXIN
					if (this.payment == 'wx') {
						if (this.$TERMINAL.m == 'nmy') {
							this.payUp(this.order_num);
						} else {
							wechatPay();
						}
					} else if (this.payment == 'sc') {
						this.payUp(this.order_num);
					}
					// #endif

					// #ifdef APP-PLUS
					this.payUp(this.order_num);
					// #endif
					return false;
				} else {
					// console.log(this.get_pay_data)
					let act_id = this.get_pay_data.act_choosed != '' ? this.get_pay_data.act_choosed.id : '00'
					if(this.actCoupon != '' && this.actCoupon.kw6 == '1'){
						act_id = '00'
					}
					// let act_id = this.get_pay_data.act_choosed != '' && this.actCoupon !=  && this.actCoupon.kw6 == '0' ? this.get_pay_data.act_choosed.id : '00'
					var order_msg = [{
						"createuserid": this.$userMsg.userid, //创建人id
						"photo": this.get_pay_data.sku_photo.indexOf('/Media/') != -1 ? '["' + this.get_pay_data.sku_photo + '"]' : '[]', //产品图片
						"name": this.get_pay_data.shop, //商店名称
						"unit": this.get_pay_data.unit, //商店id
						"htmldata": this.get_pay_data.jsondata + ',' + this.shop_num + ',' + act_id + ',' + this.get_pay_data.id, //规格id,数量,活动id,商品id
						"gid": 3, //订单类型
						"kw0": this.get_pay_data.name,
						"kw1": this.get_pay_data.kw1, //商店电话
						"kw4": this.$base.getRSAEncryptStr(this.amount * 100), //总金额
						"kw5": '',
						"kw6": this.default_addre.name, //收货人
						"kw7": this.default_addre.phone, //收货人电话
						"kw8": this.payChoice, //付款方式
						"kw11": this.$DEVELOPER.name + "商品消费订单", //订单描述
						"kw12": this.isSL ? 1 : 0, //是否自提货物，1-是，其他-否
						"kw13": this.actCoupon != '' ? this.actCoupon.id : '', //优惠券id
						// "kw13": '1572311919295453525215', //优惠券id
						"kw17": false, //是否外卖
						"kw18": this.$base.getRSAEncryptStr(this.freight * 100), //运费
						"address": this.isSL ? this.SLPoint[this.current].value : this.default_addre.prov + this.default_addre.city +
							this.default_addre.area + this.default_addre.address, //收货地址
						"querykeyword": this.get_pay_data.shop + ',' + this.get_pay_data.name, //快速搜索
						"rpflag": this.$DEVELOPER.cid,
						"jsondata": [{
							"spuname": this.get_pay_data.name, //商品名
							"spuid": this.get_pay_data.id, //商品id
							"skuname": this.get_pay_data.sku_cont, //规格名
							"num": this.shop_num, //购买数量
							"price": this.get_pay_data.price, //单价（活动后）
							// "photo": '["' + this.get_pay_data.sku_photo + '"]' //图片
							"photo": this.get_pay_data.sku_photo.indexOf('/Media/') != -1 ? '["' + this.get_pay_data.sku_photo + '"]' :
								'[]' //图片
						}],
						"appid": this.$DEVELOPER.szblid
					}];

					console.log(order_msg);
					// return
					// let strOrder = JSON.stringify(order_msg)
					let strOrder = this.$base.jsonResToStr(order_msg)
					// console.log(strOrder);

					this.$base.szblPost('/api/sciorder?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this
						.$base.getState(), strOrder).then(res => {
						if (res.data === null) {
							uni.showToast({
								icon: "none",
								mask: false,
								title: res.msg,
								duration: 1000
							})
						} else {
							let r = this.$base.strResToJson(res.data)
							this.order_num = r[0].kw2;
							this.order_id = r[0].id;

							// this.paySuccess()
							// return

							// #ifdef H5 || MP-WEIXIN
							if (this.payment == 'wx') {
								if (this.$TERMINAL.m == 'nmy') {
									this.payUp(this.order_num);
								} else {
									wechatPay();
								}
							} else if (this.payment == 'sc') {
								this.payUp(this.order_num);
							}
							// wechatPay();
							// #endif
							// #ifdef APP-PLUS
							this.payUp(this.order_num);
							// #endif
						}
					}).catch((err) => {
						console.log(err);
						alert(this.$base.jsonResToStr(err) + "234");
						return;
					})
				}
			},
			// 检查优惠券是否达到使用标准
			checkCouponCanUse() {
				if(this.actCoupon == ''){
					this.couponList.forEach(item => {
						if (this.price >= parseFloat(item.kw4)) {
							item.canUse = true
						} else {
							item.canUse = false
						}
					})
				}
			},
			// 控制弹出层的弹出
			openCouponPopup() {
				this.$refs.popup.open()
			},
			/**
			 * 使用优惠券
			 * @param {String} id 优惠券id
			 * @param {Number} index 下标
			 */
			useCoupon(coupon, index) {
				for (let i = 0; i < this.couponList.length; i++) {
					if (i == index) {
						this.couponList[i].isUse = !this.couponList[i].isUse
						this.couponList[i].isUse ? this.actCoupon = this.couponList[i] : this.actCoupon = ''
					} else {
						this.couponList[i].isUse = false
					}
				}
				// this.actCoupon = coupon
				this.amount = this.countPrice()
				this.$refs.popup.close()
			}
		},
		// 		beforeMount() {
		// 			this.updateCity();
		// 			this.updateDistrict();
		// 		},
		// 		watch: {
		// 			prov() {
		// 				this.updateCity();
		// 				this.updateDistrict();
		// 			},
		// 			city() {
		// 				this.updateDistrict();
		// 			}
		// 		}
	}
</script>

<style>
	.paymoney .money span.sec {
		font-size: 24upx;
	}

	.address {
		padding: 2% 13.33% 3%;
		line-height: 60upx;
	}

	.address h3 b {
		padding: 0 36upx;
	}

	.address h3 {
		font-size: 30upx;
	}

	.address .detail {
		font-size: 26upx;
		padding-left: 50upx;
		margin-left: -50upx;
	}

	.address:after {
		right: 5%;
	}

	.address-btn {
		padding: 0 6%;
		line-height: 160upx;
	}

	.address-sec .icon-youbian {
		font-size: 28upx;
	}

	.address-sec .icon-bianji {
		font-size: 50upx;
		padding-right: 25upx;
	}

	.address-sec li {
		border: none;
	}

	.pay-unbtn {
		background: #8a8a8a !important;
	}

	.kg {
		height: 34upx;
		width: 80upx;
		border: 1px solid #999;
		border-radius: 17upx;
		float: right;
		line-height: 34upx;
		position: relative;
		transition: all .5s;
	}

	.kg .yuan {
		width: 28upx;
		height: 28upx;
		border-radius: 50%;
		background: #999;
		position: absolute;
		left: 1upx;
		top: 50%;
		margin-top: -14upx;
		transition: all .5s;
	}

	.kg.ac .yuan {
		left: 46upx;
		transition: all .5s;
		background: #fff;
	}

	.kg.ac {
		background: #00a0ea;
		border-color: #fff;
		transition: all .5s;
	}

	.self-lifting-wrap {
		padding: 10upx 20upx;
		margin-bottom: 10upx;
		background: #FFFFFF;
	}

	.self-lifting-wrap .title {}

	.self-lifting-wrap .content {
		display: flex;
		flex-direction: column;
	}

	.sl-radio {
		display: flex;
		flex-direction: column;
		padding: 0 14upx;
	}

	.sl-radio .item {
		height: 60upx;
		line-height: 60upx;
	}

	.is-coupon {
		padding: 10upx 20upx;
		background: #00a0ea6E;
		overflow: hidden;
		color: #fff;
		margin-top: 10upx;
	}

	.shop-num {
		position: absolute;
		right: 40upx;
	}



	.alarm {
		margin-top: 20upx;
		color: red;
	}

	.alarm text {
		color: #000000;
	}

	.discount-wrap {
		background: #fff;
		margin-top: 10upx;
		padding: 20upx;
	}

	.discount-wrap .item {
		display: flex;
		justify-content: space-between;
	}


	.discount-wrap .item text:last-child {
		color: #e02e24;
	}

	.origin-price {
		text-decoration: line-through;
		font-size: 24upx;
		color: #888;
	}
</style>
