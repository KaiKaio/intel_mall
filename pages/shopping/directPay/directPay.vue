<template>
	<!-- 用于PC美食、门票、民宿扫码支付的页面 -->
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '', //业务订单id
				payOrderId: '', //实际支付订单id
				order: '', //订单详情
				msg: {
					//信息模板
					name: "",
					remarks: "",
					status: "新加",
					id: ""
				},
				newMsg: {
					"phones": "",
					"smsid": "1566462939231915455699",
					"appid": this.$DEVELOPER.szblid,
					"cn_1": "",
					"cn_2": "新加",
					"cn_3": "",
					"cn_4": ""
				},
				phone: '' //手机号
			}
		},
		/**
		 * @param {Object} obj obj.oi-业务订单id，obj.poi-支付订单id
		 */
		onLoad(obj) {
			this.orderId = obj.oi 
			this.payOrderId = obj.poi
		},
		onShow() {
			this.isLogin()
		},
		methods: {
			isLogin() {
				this.$base.autoLogin(this.$DEVELOPER.szblid).then(res => {
					if (this.orderId == 1) {
						//美食订单确认
						uni.navigateTo({
							url: '/pages/order/orderCheck/orderCheck?id=' + this.orderid,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					} else {
						this.getOrderDetail()
					}
				}).catch(msg => {
					this.$store.commit('set_page_data', {
						page: '/pages/shopping/directPay/directPay?poi=' + this.payOrderId + '&oi=' + this.orderId,
					})
					uni.navigateTo({
						url: '/pages/component/login/login?m=null',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				})
				//判断登录状态
				// if (this.$userMsg.userid == null) {
				// 	this.$store.commit('set_page_data', {
				// 		page: '/pages/shopping/directPay/directPay?poi=' + this.payOrderId + '&oi=' + this.orderId,
				// 	})
				// 	uni.navigateTo({
				// 		url: '/pages/component/login/login?m=null',
				// 		success: res => {},
				// 		fail: () => {},
				// 		complete: () => {}
				// 	});
				// } else {
				// 	if (this.orderId == 1) {
				// 		//美食订单确认
				// 		uni.navigateTo({
				// 			url: '/pages/orderVerify/orderVerify?poi=' + this.payOrderId,
				// 			success: res => {},
				// 			fail: () => {},
				// 			complete: () => {}
				// 		});
				// 	} else {
				// 		this.getOrderDetail()
				// 	}
				// }
			},
			getOrderDetail() {
				//获取订单信息
				this.$base.szblGet('/api/scorder/' + this.orderId, {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState()
				}).then((dataJson) => {
					if (dataJson.data != "") {
						this.order = this.$base.strResToJson(dataJson.data);
						if(this.order.createuserid != this.$userMsg.userid){
							uni.showToast({
								icon: "none",
								mask: false,
								title: "该订单不是您的订单！",
								duration: 2000,
								complete: () => {
									setTimeout(() => {
									 	uni.reLaunch({
											url: '/pages/tabBar/member/member'
										})
									}, 2000);
								}
							})
						}else{
							this.payUp()
						}
					}
				}).catch((msg) => {
					uni.showToast({
						icon: "none",
						mask: false,
						title: "失效订单",
						duration: 1000
					})
					console.log(msg)
				})
			},
			// 支付实现
			payUp() {
				this.newMsg.cn_1 = this.order.kw0;
				this.newMsg.cn_4 = this.orderId;
				this.newMsg.phones = this.order.kw1
				// this.phone = this.order.kw1;
				if (this.order.gid == "1") {
					this.newMsg.cn_2 = "民宿的新"
					this.newMsg.cn_3 = "请在半小时内在后台确认是否接受订单,逾期将自动失效."
				} else if (this.order.gid == "2") {
					if (this.order.kw17 == "true" || this.order.kw17 == true) {
						this.newMsg.cn_3 = this.order.kw6 + "下单了一份外卖订单，请尽快送至 ' " + this.order.address + " '，联系电话：" + this.order.kw7;
					} else {
						this.newMsg.cn_3 = this.order.kw6 + "下单了一份美食订单";
					}
				} else if (this.order.gid == "3") {
					this.newMsg.cn_3 = this.order.kw6 + "购买了" + this.order.name.replace(/【/g, " ").replace(/】/g, " ");
				} else if (this.order.gid == "4") {
					this.newMsg.cn_3 = this.order.kw6 + "预订了" + (this.order.name + "(" + this.order.kw9 + ")").replace(/【/g, " ").replace(
						/】/g, " ")
				} else if (this.order.gid == "5") {
					this.newMsg.cn_3 = this.order.kw6 + "购买了（爱心产品）" + this.order.name.replace(/【/g, " ").replace(/】/g, " ");
				}
				
				this.$base.getWxPay(this.$userMsg.userid, this.$userMsg.token, this.payOrderId, this.$DEVELOPER.wxPayMarkPUBLIC, uni.getStorageSync("wxOpenid")).then(res =>{
					//支付成功
					if (res == "ok") {
						this.$base.paySuccess(0, this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.szblid, this.orderId, this.newMsg.phones,
							this.newMsg.cn_1, this.newMsg.cn_2, this.newMsg.cn_3)
					}
				})
				
			}
		}
	}
</script>

<style>

</style>
