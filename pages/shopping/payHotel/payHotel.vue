<template>
	<!-- 民宿支付页 -->
	<view class="order-detail">
		<view class="hotel-order-wrap bg-hdsh">
			<view class="hotel-order-detail">
				<text>{{get_hotel_data.room}}</text>
				<!-- <text>无早 | 1.8米床/1张 | 无窗</text> -->
				<text>{{get_hotel_data.kw8}}</text>
				<text>入住时间 {{get_hotel_data.stime}}</text>
				<text>离店时间 {{get_hotel_data.etime}}</text>
				<text>{{get_hotel_data.kw5}} 间 | 共 {{get_hotel_data.numDate}} 晚</text>
			</view>
		</view>
		<view class="hotel-orderer-msg">
			<view class="wrap-ul">
				<view class="wrap-li">
					<text>联系人</text>
					<input type="text" placeholder="请输入联系人姓名" v-model="show_msg.name">
				</view>
				<view class="wrap-li">
					<text>手机号</text>
					<input type="number" placeholder="请输入联系人手机号" maxlength="11" v-model="show_msg.phone">
				</view>
				<!-- <view class="wrap-li">
					<text>到店时间</text>
					<text>当天18:00之前到店</text>
				</view> -->
			</view>
		</view>
		<view class="receipt">
			<text>发票</text>
			<text>如需发票，请离店时向前台索取</text>
		</view>
		<!-- <view class="pay">
			<text class="font-icon fr">&#xe7b0;</text>
			<view class="weixin"><span>微信支付</span><em>推荐</em></view>
			<text class="font-icon fr">&#xe622;</text>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<view class="choose-payment">
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
			<text class="font-icon">&#xe7b0;</text>
			<view class="weixin"><span>微信支付</span><em>推荐</em></view>
			<text class="font-icon fr">&#xe622;</text>
		</view>
		<!-- #endif -->

		<view class="hotel-refund" v-if="get_hotel_data.kw12 == '0'">
			<text>取消规则</text>
			<!-- <span>订单确认后，{{get_hotel_data.stime}} 18点前可取消，逾期不可取消/变更</span> -->
			<!-- <span>订单确认后，可于入住日期前两天的18点前免费取消，逾期不可取消/变更</span>
			<span>如未入住，酒店将扣除全额房费；房间整晚保留，请及时入住</span> -->
			<text> • 入住日期0点前24小时外可免费取消</text>
			<text> • 入住日期0点前24小时内取消扣第一晚房费的50%做手续费</text>
			<text> • 当天取消扣出第一晚房费的100%</text>
		</view>

		<view class="hotel-refund" v-if="get_hotel_data.kw12 == '1'">
			<text>取消规则</text>
			<!-- <span>订单确认后，{{get_hotel_data.stime}} 18点前可取消，逾期不可取消/变更</span> -->
			<!-- <span>订单确认后，可于入住日期前两天的18点前免费取消，逾期不可取消/变更</span>
			<span>如未入住，酒店将扣除全额房费；房间整晚保留，请及时入住</span> -->
			<text> • 入住日期18点前免费取消</text>
		</view>

		<view class="paymoney">
			<view class="money">实付款<span>¥{{get_hotel_data.kw4}}</span></view>
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
				show_msg: {}, //联系人信息
				order_num: '', //支付订单id
				order_id: '', //业务订单id
				payment: 'wx',
				payChoice: "微信",
				addre_list: "",
				timeAfter: 0, //防抖
				timeNow: 0 //防抖
			};
		},
		computed: {
			...mapGetters(['get_hotel_data'])
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
			}
		},
		onLoad() {
			//查收货地址
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then(resData => {
				var res = this.$base.strResToJson(resData.data).address
				if (res == "" || res == "[]" || res == null) {
					this.addre_list = []
				} else {
					this.addre_list = res
					for (var i = 0; i < this.addre_list.length; i++) {
						if (this.addre_list[i].isDefault == true) {
							this.show_msg = this.addre_list[i]
						}
					}
					// console.log(this.show_msg)
				}
			}).catch((msg) => {
				console.log(msg)
			})
		},
		methods: {
			/**
			 * 支付方法
			 * @param {String} orderid 实际支付订单
			 */
			payUp(orderid) {

				// 				uni.getProvider({
				// 					service: 'payment',
				// 					success: (res) => {
				// 						console.log(res)
				// 						console.log(this.$base.jsonResToStr(res))
				// 					}
				// 				})
				// return;
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
					}).then(dataJson => {
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
										url: '/pages/order/orderHotel/orderHotel?type=0',
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
					this.$base.szblGet("/api/wechatpayApp/" + orderid, {
						wxsid: mark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then(dataJson => {
						this.$PAYSUCCMSG.length = 0
						let obj = {
							phones : this.get_hotel_data.store_phone,
							cn_1 : this.get_hotel_data.kw0,
							cn_2 : "民宿的新",
							cn_3 : "请在半小时内在后台确认是否接受订单,逾期将自动失效.",
							order_id : this.order_id
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
										url: '/pages/order/orderHotel/orderHotel?type=0',
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
						console.log(msg);
						uni.hideToast();
					})
				}
			},
			// 支付成功后通知商家
			paySuccess() {
				let obj = {
					"phones": this.get_hotel_data.store_phone,
					"cn_1": this.get_hotel_data.kw0,
					"cn_2": "民宿的新",
					"cn_3": "请在半小时内在后台确认是否接受订单,逾期将自动失效.",
				}

				this.$base.paySuccess(0, this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.szblid, this.order_id, obj.phones,
					obj.cn_1, obj.cn_2, obj.cn_3)
			},
			// 修改支付标识
			changePayment(mark) {
				this.payment = mark
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
				// #ifdef H5
				// var ua = window.navigator.userAgent.toLowerCase();
				// if (ua.match(/MicroMessenger/i) != 'micromessenger') {
				// 	uni.showToast({
				// 		title: '请关注“海岛生活”微信公众号打开',
				// 		icon: 'none',
				// 		mask: false,
				// 		duration: 1000
				// 	});
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
						uni.getStorageSync("wxOpenid")).then(res => {
						//支付成功
						// if (res == "ok") {
						_this.paySuccess();
						// }
					}).catch((msg) => {
						alert(msg);
					});
					// #endif

					// #ifdef MP-WEIXIN
					// 微信小程序支付
					_this.$base.getWxxcxPay(_this.$userMsg.userid, _this.$userMsg.token, _this.order_num, _this.$DEVELOPER.wxPayMarkXCX,
						uni.getStorageSync("wxXCXOpenid")).then(res => {
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


				if (!this.show_msg.name) {
					uni.showToast({
						title: '请填写联系人姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return false;
				}
				if (!this.show_msg.phone) {
					uni.showToast({
						title: '请填写联系方式',
						icon: 'none',
						mask: false,
						duration: 1500
					});
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
					for (let i = 0; i < this.get_hotel_data.photo.length; i++) {
						this.get_hotel_data.photo[i] = this.get_hotel_data.photo[i].substr(this.get_hotel_data.photo[i].indexOf("/Media"))
					}
					let order_msg = [{
						// let order_msg = {
						"appid": this.$DEVELOPER.szblid,
						"createuserid": this.$userMsg.userid, //创建人id
						"photo": this.get_hotel_data.photo, //产品图片
						// "photo": this.get_hotel_data.photo.indexOf('/Media/') != -1 ? '["' + this.get_hotel_data.photo + '"]' : '[]', //产品图片
						"stime": this.get_hotel_data.stime, //开始时间
						"etime": this.get_hotel_data.etime, //结束时间
						// "name": this.get_hotel_data.room, //产品标题(房型名称
						"name": this.get_hotel_data.kw0, //商店名称
						"htmldata": this.get_hotel_data.normId + ',' + this.get_hotel_data.kw5 + ',00,' + this.get_hotel_data.cid, //规格id,数量,活动id,房型id
						"cid": this.get_hotel_data.cid, //产品id
						"gid": 1, //订单类型
						// "kw0": this.get_hotel_data.kw0, //商店名称
						"kw0": this.get_hotel_data.room, //产品标题(房型名称
						"kw1": this.get_hotel_data.store_phone, //商店电话
						// "kw4": Math.floor(this.get_hotel_data.kw4 * 100) / 100, //总金额
						"kw4": this.$base.getRSAEncryptStr(this.get_hotel_data.kw4 * 100), //总金额
						"kw5": this.$base.getRSAEncryptStr(this.get_hotel_data.kw5), //数量(房间数)
						"kw6": this.show_msg.name, //收货人
						"kw7": this.show_msg.phone, //收货人电话
						"kw8": this.payChoice, //支付方式
						"kw11": this.$DEVELOPER.name + "民宿消费订单", //订单描述
						"kw13": this.get_hotel_data.kw12, //是否收取退房手续费
						"kw17": false, //是否外卖
						// "kw18": 0, //运费
						// "appid": this.$DEVELOPER.szblid,
						"rpflag": this.$DEVELOPER.cid,
						// "querykeyword": this.get_hotel_data.room + ',' + this.get_hotel_data.kw0, //快速搜索
						"querykeyword": this.get_hotel_data.kw0, //快速搜索
						"unit": this.get_hotel_data.unit, //商店id
						// "jsondata": this.get_hotel_data.normId + ',' + this.get_hotel_data.kw5 + ',00', //规格id,数量,活动id
					}];
					// };
					// let strOrder = JSON.stringify(order_msg)
					let strOrder = this.$base.jsonResToStr(order_msg)
					// console.log(strOrder,order_msg,this.get_hotel_data.photo);
					// return

					this.$base.szblPost('/api/sciorder?m=' + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" + this.$base
						.getState(), strOrder).then(res => {

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
						alert(err);
						return;
					})
				}
			}
		}
	}
</script>

<style>
	.paymoney .money span.sec {
		font-size: .24rem;
	}

	.address {
		padding: 2% 13.33% 3%;
		line-height: .6rem;
	}

	.address h3 b {
		padding: 0 .36rem;
	}

	.address h3 {
		font-size: .3rem;
	}

	.address .detail {
		font-size: .26rem;
		padding-left: .5rem;
		margin-left: -.5rem;
	}

	.address:after {
		right: 5%;
	}

	.address-btn {
		padding: 0 6%;
		line-height: 1.6rem;
	}

	.address-sec .icon-youbian {
		font-size: .28rem;
	}

	.address-sec .icon-bianji {
		font-size: .5rem;
		padding-right: .25rem;
	}

	.address-sec li {
		border: none;
	}

	.hotel-refund {
		flex-direction: column;
		border: none;
		margin-bottom: 100upx !important;
	}

	.hotel-refund text {
		margin-bottom: 10upx;
		color: #666;
		font-size: 20upx;
	}

	.hotel-refund text:first-child {
		font-size: 30upx;
		color: #000;
	}
</style>
