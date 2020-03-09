<template>
	<!-- 套票支付页 -->
	<view class="app-init order-detail">
		<view class="shop-pay">
			<view class="pay-jd-head sec">
				<view class="play-flex-cont name">
					<h5>联系人</h5>
					<view class="hint"><input type="text" v-model="show_msg.name" :disabled="order_id != ''" placeholder="请输入联系人姓名" /></view>
				</view>
				<view class="play-flex-cont name">
					<h5>手机号码</h5>
					<view class="hint"><input type="text" v-model="show_msg.phone" :disabled="order_id != ''" placeholder="请输入联系人手机号码" /></view>
				</view>
			</view>

			<h2 class="name">{{get_package_data.name}}</h2>
			<!-- 预览 -->
			<ul class="list-product">
				<li>
					<a href="javascript:history.back()">
						<img class="list-pro-img fl" :src="order_photo" alt="" />
						<view class="list-pro-text fr">
							<!-- <h2>{{get_package_data.name}}</h2> -->
							<view class="list-norm">
								<p>规格：</p>
								<view class="item" v-for="(x,index) in get_package_list_data" :key="index">
									<text>{{x.name}}</text>
									<!-- <view class="">
										<text>单价：</text>
										<view class="">
											<text class="price">¥{{x.kw9}}</text><text class="old-price">¥{{x.kw0}}</text><text>{{'*' + x.kw10}}</text>
										</view>
									</view> -->
									<text>
										<text class="fl">单价：</text>
										<text class="price fl">¥{{x.kw9}}</text>
										<text class="old-price fl">¥{{x.kw0}}</text>
										<text class="fr">{{'*' + x.kw10}}</text>
									</text>
								</view>
							</view>
						</view>
					</a>
				</li>
			</ul>
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

		<view class="paymoney">
			<view class="money">
				实付款<span>¥{{get_package_data.kw4}}</span>
			</view>
			<view class="pay-btn bg-hdsh" @click="paySubmit">立即支付</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				shop_num: '',
				show_msg: {}, //收货人信息
				order_num: '', //支付订单id
				order_id: '', //业务订单id
				default_photo: require("@/static/icon/default.png"),
				order_photo: '', //订单图片
				addre_list: [], //地址列表
				payment: 'wx',
				payChoice: "微信",
				// cardId: '2081110000100122824', //智慧卡卡号
				// pwd: '111111', //智慧卡密码
				timeAfter: 0, //防抖
				timeNow: 0 //防抖
			};
		},
		computed: {
			...mapGetters(['get_package_data', 'get_package_list_data', 'get_address_data'])
		},
		watch: {
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
		},
		onLoad(obj) {
			// console.log(this.get_package_list_data)
			this.order_photo = this.get_package_data.photo == '' ? this.default_photo : this.$base.urlPrex + this.get_package_data
				.photo
		},
		onShow() {
			//查收货地址
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
					if (res == "" || res == "[]" || res == null) {
						this.addre_list = []
					} else {
						this.addre_list = res
						for (var i = 0; i < this.addre_list.length; i++) {
							if (this.addre_list[i].isDefault == true) {
								this.show_msg = this.addre_list[i];
							}
						}
						// console.log(this.show_msg)
					}
				}
			}).catch((msg) => {
				console.log(msg)
			})
		},
		methods: {
			// 修改支付标识
			changePayment(mark) {
				this.payment = mark
			},
			/**
			 * 支付方法
			 * @param {String} orderid 实际支付订单
			 */
			payUp(orderid) {
				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000,
				});
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
										url: '/pages/order/orderPackage/orderPackage?type=0',
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
					if(this.$TERMINAL.m == 'nmy'){
						// 农民云调起微信支付
						mark = this.$DEVELOPER.nmyPayMarkApp
					}else{
						mark = this.$DEVELOPER.wxPayMarkAPP
					}
					uni.showLoading({
						mask:false
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
							phones: this.get_package_data.kw1,
							// cn_1: "清溪商城",
							cn_1: this.$DEVELOPER.name,
							cn_2: "套票",
							cn_3: this.show_msg.name + "购买了" + this.get_package_data.name.replace(/【/g, " ").replace(/】/g, " "),
							order_id: this.order_id
						}
						this.$PAYSUCCMSG.push(obj)
						if (this.$TERMINAL.os == 'i') {
							window.webkit.messageHandlers.iosWechatPay.postMessage({body: JSON.parse(dataJson.data)});
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
										url: '/pages/order/orderPackage/orderPackage?type=0',
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
									url: '/pages/order/orderPackage/orderPackage?type=all',
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
					"phones": this.get_package_data.kw1,
					// "cn_1": "清溪商城",
					"cn_1": this.$DEVELOPER.name,
					"cn_2": "套票",
					"cn_3": this.show_msg.name + "购买了" + this.get_package_data.name.replace(/【/g, " ").replace(/】/g, " "),
				}

				this.$base.paySuccess(0, this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.szblid, this.order_id, obj.phones,
					obj.cn_1, obj.cn_2, obj.cn_3)

			},
			// 下单并调起支付
			paySubmit() {
				let _this = this
				let delayTime = 1500
				this.timeNow = Date.now()
				if(this.timeNow - this.timeAfter >= 1500){
					this.timeAfter = this.timeNow
				}else{
					uni.showToast({
						mask:false,
						title:'请勿重复下单',
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
				// 		title: '请关注“清溪商城”微信公众号打开',
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
						alert(_this.$base.jsonResToStr(msg));
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
				if (this.show_msg.name == '' || this.show_msg.phone == '') {
					uni.showToast({
						icon: 'none',
						mask: false,
						title: '请填写联系人信息',
						duration: 1500
					})
					return false;
				}
				if (this.order_num) {
					// #ifdef H5 || MP-WEIXIN
					if (this.payment == 'wx') {
						if(this.$TERMINAL.m == 'nmy'){
							this.payUp(this.order_num);
						}else{
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
					var order_msg = [{
						// var order_msg = {
						"createuserid": this.$userMsg.userid, //创建人id
						"appid": this.$DEVELOPER.szblid,
						// "photo": '["' + this.get_package_data.photo + '"]', //产品图片
						"photo": this.get_package_data.photo.indexOf('/Media/') != -1 ? '["' + this.get_package_data.photo + '"]' : '[]', //产品图片
						// "name": this.get_package_data.name, //产品标题
						// "name": '清溪商城', //商店名称
						"name": this.$DEVELOPER.name, //商店名称
						"unit": this.get_package_data.unit, //商店id
						"cid": this.get_package_data.cid, //产品id
						"gid": this.get_package_data.gid, //订单类型
						// "kw0": '清溪商城', //商店名称
						"kw0": this.get_package_data.name, //产品标题
						"kw1": this.get_package_data.kw1, //商店电话
						"kw4": this.$base.getRSAEncryptStr(this.get_package_data.kw4 * 100), //总金额
						"kw5": this.$base.getRSAEncryptStr(this.get_package_data.kw5), //数量
						"kw6": this.show_msg.name, //收货人
						"kw7": this.show_msg.phone, //收货人电话
						"kw8": this.payChoice, //付款方式
						// "kw11": "清溪商城套票消费订单", //订单描述
						"kw11": this.$DEVELOPER.name + "套票消费订单", //订单描述
						// "kw12": 0, //是否自提货物，1-是，其他-否
						// "kw17": false, //是否外卖
						// "kw18": 0, //运费
						// "appid": this.$DEVELOPER.szblid,
						"rpflag": this.$DEVELOPER.cid,
						"address": '', //收货地址
						// "querykeyword": this.get_package_data.name + ',清溪商城' , //快速搜索
						// "querykeyword": '清溪商城', //快速搜索
						"querykeyword": this.$DEVELOPER.name, //快速搜索
					}];
					// };
					// let strOrder = JSON.stringify(order_msg)
					let strOrder = this.$base.jsonResToStr(order_msg)
					// console.log(strOrder,order_msg,this.get_package_data.photo);
					// return

					this.$base.szblPost('/api/sciorder?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg.token + '&state=' + this
						.$base.getState(),
						strOrder).then(res => {
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
								if(this.$TERMINAL.m == 'nmy'){
									this.payUp(this.order_num);
								}else{
									wechatPay();
								}
							} else if (this.payment == 'sc') {
								this.payUp(this.order_num);
							}
							// #endif
							// #ifdef APP-PLUS
							this.payUp(this.order_num);
							// #endif
						}
					}).catch((err) => {
						console.log(err);
						// alert(err);
						return;
					})
				}
			}
		},
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

	.play-flex-cont {
		display: flex;
	}

	.pay-jd-head {
		background: #fff;
		/* padding: 0 4%; */
		margin-bottom: 15upx;
		/* width: 750upx; */
	}

	.pay-jd-head .name:last-child {
		border: none;
	}

	.pay-jd-head .name {
		padding: 25upx 20upx 25upx 30upx;
		/* padding: 25upx 0; */
		border-bottom: 2upx solid #eee;
		justify-content: space-between;
	}

	.pay-jd-head .name h3 {
		line-height: 38upx;
		font-size: 36upx;
		width: 70%;
	}

	.pay-jd-head .name a {
		font-size: 24upx;
		/* color: #7bbfea; */
		color: #00A0EA;
	}

	.pay-jd-head .name h4 {
		font-size: 28upx;
		width: 140upx;
	}

	.pay-jd-head h5 {
		font-size: 24upx;
		color: #999;
		width: 140upx;
	}

	.pay-jd-head .hint {
		font-size: 24upx;
		width: 70%;
	}

	.pay-jd-head.sec .name {
		justify-content: inherit;
	}

	.pay-jd-head.sec b {
		font-weight: normal;
		color: #e02e24;
	}

	.pay-jd-head.sec input {
		width: 100%;
	}

	.list-norm {
		line-height: 34upx;
		color: #888888;
		font-size: 24upx;
	}

	.list-norm .item {
		font-size: 24upx;
		display: flex;
		flex-direction: column;
	}

	.list-norm .item .price {
		color: #e02e24;
		width: 18%;
	}

	.list-norm .item .old-price {
		text-decoration: line-through;
	}
</style>
