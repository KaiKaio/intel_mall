<template>
	<!-- 美食支付页 -->
	<view>
		<view class="pay-cate-detail-top">
			<!-- <view class="sku-selector-bg" v-show="eait" @click="eaitToggle"></view> -->

			<view class="cate-pay">
				<view class="name">{{get_pay_data.name}}</view>
				<!-- <view>用餐人数</view> -->
				<!-- 预览 -->
				<view class="wrap-ul">
					<view class="wrap-li" v-for="(item,index) in get_pay_data.list" :key="index">
						<view class="cate-pay-img">
							<!-- <image :src="$base.urlPrex + item.photo"></image> -->
							<image :src="item.photo"></image>
						</view>
						<view class="cate-pay-name">
							{{item.name}}
							<p>¥{{item.price}}</p>
						</view>
						<view class="cate-pay-num">
							x{{item.num}}
						</view>
					</view>
				</view>
			</view>
			<view class="pay" v-if="get_pay_data.parcel == 'true'">
				<span>是否需要外卖</span>
				<text v-if="waimai" class="font-icon fr" @click="waimaiToggle">&#xe622;</text>
				<text v-else class="fr" @click="waimaiToggle">请点击</text>
			</view>
			<view class="orderer-msg">
				<view class="wrap-ul">
					<view class="wrap-li">
						<span>订餐人</span>
						<input type="text" placeholder="请输入订餐人姓名" v-model="show_msg.name">
					</view>
					<view class="wrap-li">
						<span>手机号</span>
						<input type="number" placeholder="请输入订餐人手机号码" maxlength="11" v-model="show_msg.phone">
					</view>
					<view class="wrap-li">
						<span>备注</span>
						<input type="text" placeholder="请输入您的口味、偏好要求等">
					</view>
					<view class="waimai wrap-li" v-if="waimai">
						<span>详细地址</span>
						<textarea placeholder="请输入您的详细地址" v-model="show_msg.address"></textarea>
					</view>
				</view>
			</view>

			<!-- #ifdef H5 || MP-WEIXIN-->
			<view class="pay">
				<text class="font-icon fr">&#xe7b0;</text>
				<view class="weixin"><span>微信支付</span><em>推荐</em></view>
				<text class="font-icon fr">&#xe622;</text>
			</view>
			<!-- #endif -->

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


			<view class="orderer-msg">
				<view class="name">
					其他说明
				</view>
				<p v-if="waimai" class="other-msg" style="color:#e02e24">外卖服务为商家自选服务，如配送过程中出现任何问题请与商家自行协商则，与本平台无关。</p>
				<p class="other-msg">提交订单成功后，凭订单信息到店用餐</p>
			</view>

			<!-- <Login :login_mask="login_mask" @childToParent="child"></Login> -->
		</view>
		<view class="paymoney">
			<view class="money">实付款<span>¥{{amount? amount :''+get_pay_data.yf}}</span><span v-show="show_mark" class="sec">{{parseInt(get_pay_data.yf) ? '额外配送费'+get_pay_data.yf+'元' : '免配送费'}}</span></view>
			<!-- <view class="money" v-if="isCate">实付款<span>¥{{get_pay_data.price}}</span><span v-show="show_mark" class="sec">{{parseInt(get_pay_data.yf) ? '额外配送费'+get_pay_data.yf+'元' : '免运费'}}</span></view> -->
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
				waimai: false, //是否选择外卖，使用率 0.00000000000000000000000000000000001%
				// eait: false, //控制某个标签的显示状态，不知道有啥用
				// prov: '海南',
				// city: '海口',
				// district: '龙华区',
				// cityArr: [],
				// districtArr: [],
				// name: '',
				// tel: '',
				// address: '',
				shop_num: '', //购买的总量
				show_msg: { //收货信息
					prov: '',
					city: '',
					district: '',
					name: '',
					tel: '',
					address: ''
				},
				order_num: '', //支付订单id
				order_id: '', //业务订单id
				show_mark: false,
				// zonMsg: JSON.parse(localStorage.zonMsg),
				default_photo: require("@/static/icon/default.png"),
				// order_photo: '',
				amount: 0, //总价
				payment: 'wx', //支付标识
				payChoice: "微信", //支付标识
				addre_list: "", //收货地址列表
				timeAfter: 0, //防抖
				timeNow: 0 //防抖
			};
		},
		computed: {
			...mapGetters(['get_pay_data'])
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
			// this.order_photo = this.get_pay_data.sku_photo == '' ? this.default_photo : this.$base.urlPrex + this.get_pay_data.sku_photo,
			this.shop_num = this.get_pay_data.shop_num;
			// this.amount = Math.floor(this.get_pay_data.price * this.shop_num * 100) / 100;
			this.amount = this.get_pay_data.price;
			for (var q = 0; q < this.get_pay_data.list.length; q++) {
				if (this.get_pay_data.list[q].photo != '') {
					this.get_pay_data.list[q].photo = this.get_pay_data.list[q].photo
				} else {
					this.get_pay_data.list[q].photo = this.default_photo
				}
			}

			//查收货地址
			this.$base.szblGet("/api/user/" + this.$userMsg.userid, {
				m: this.$userMsg.userid,
				tk: this.$userMsg.token,
				state: this.$base.getState(),
			}).then((resData) => {
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
				this.$store.commit('set_address_data', this.addre_list)
			}).catch((msg) => {
				console.log(msg)
			})
		},
		methods: {
			// 修改支付标识
			changePayment(mark) {
				this.payment = mark
			},
			// 更改外卖状态
			waimaiToggle() {
				this.waimai = !this.waimai;
				// console.log(this.waimai);
			},
			// eaitToggle() {
			// 	if (this.order_num) {
			// 		uni.showToast({
			// 			icon: "none",
			// 			mask: false,
			// 			title: "订单已生成不可修改",
			// 			duration: 1000
			// 		})
			// 		return;
			// 	}
			// 	this.eait ? this.eait = false : this.eait = true
			// },
			// updateCity() {
			// 	for (var i in this.arr) {
			// 		var obj = this.arr[i];
			// 		if (obj.name == this.prov) {
			// 			this.cityArr = obj.sub;
			// 			break;
			// 		}
			// 	}
			// 	this.city = this.cityArr[1].name;
			// },
			// updateDistrict() {
			// 	for (var i in this.cityArr) {
			// 		var obj = this.cityArr[i];
			// 		if (obj.name == this.city) {
			// 			this.districtArr = obj.sub;
			// 			break;
			// 		}
			// 	}
			// 	if (this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
			// 		this.district = this.districtArr[1].name;
			// 	} else {
			// 		this.district = '';
			// 	}
			// },
			
			/**
			 * 支付方法
			 * @param {String} orderid 实际支付订单
			 */
			payUp(orderid) {
				// console.log(orderid)

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
										url: '/pages/order/orderCate/orderCate?type=0',
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
					// APP调起微信支付
					let mark = ''
					if(this.$TERMINAL.m == 'nmy'){
						// 农民云支付标识
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
							phones: this.get_pay_data.store_phone,
							cn_1: this.get_pay_data.store_name,
							cn_2: "新加",
							cn_3: "",
							order_id: this.order_id
						}
						if (this.waimai == true) {
							obj.cn_3 = this.show_msg.name + "下单了一份外卖订单，请尽快送至 ' " + this.show_msg.address + " '，联系电话：" + this.show_msg
								.phone;
						} else {
							obj.cn_3 = this.show_msg.name + "下单了一份美食订单，联系电话：" + this.show_msg.phone;
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
									uni.reLaunch({
										url: '/pages/order/orderCate/orderCate?type=0',
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
					"phones": this.get_pay_data.store_phone,
					"cn_1": this.get_pay_data.store_name,
					"cn_2": "新加",
					"cn_3": "",
				}
				if (this.waimai == true) {
					obj.cn_3 = this.show_msg.name + "下单了一份外卖订单，请尽快送至 ' " + this.show_msg.address + " '，联系电话：" + this.show_msg
						.phone;
				} else {
					obj.cn_3 = this.show_msg.name + "下单了一份美食订单，联系电话：" + this.show_msg.phone;
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

				// #ifdef H5
				// var ua = window.navigator.userAgent.toLowerCase();
				// if (ua.match(/MicroMessenger/i) != 'micromessenger') {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		mask: false,
				// 		title: '请关注“海岛生活”微信公众号打开',
				// 		duration: 1000
				// 	})
				// 	return false;
				// }
				// #endif
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
						alert(msg);
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


				if (!this.show_msg.name) {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				if (!this.show_msg.phone) {
					uni.showToast({
						title: '请填写联系方式',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
				}
				if (!this.show_msg.address && this.waimai) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none',
						mask: false,
						duration: 1500
					});
					return;
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
					var order_msg = [{
						// var order_msg = {
						"createuserid": this.$userMsg.userid, //创建人id
						// "photo": '["' + this.get_pay_data.sku_photo.slice(this.get_pay_data.sku_photo.indexOf("/Media")) + '"]', //产品图片
						"photo": this.get_pay_data.sku_photo.indexOf('/Media/') != -1 ? '["' + this.get_pay_data.sku_photo.slice(this.get_pay_data.sku_photo.indexOf("/Media")) + '"]' : '[]', //产品图片
						// "name": this.get_pay_data.name, //产品标题
						"name": this.get_pay_data.kw0, //商店名称
						"htmldata": this.get_pay_data.jsondata, //规格id,数量,活动id
						// "cid": this.get_pay_data.cid, //产品id
						"gid": this.get_pay_data.gid, //订单类型：1.民宿 2.美食 3.商品 4.票务 5.爱心消费
						"kw0": this.get_pay_data.kw0, //商店名称
						"kw1": this.get_pay_data.store_phone, //商店电话
						"kw4": this.$base.getRSAEncryptStr(this.get_pay_data.price * 100), //总金额
						"kw5": this.$base.getRSAEncryptStr(this.shop_num), //数量
						"kw6": this.show_msg.name, //收货人
						"kw7": this.show_msg.phone, //收货人电话
						"kw8": this.payChoice, //付款方式
						// "kw11": "清溪商城美食消费订单", //订单描述
						"kw11": this.$DEVELOPER.name + "美食消费订单", //订单描述
						"kw17": this.waimai, //是否外卖
						"kw18": 0, //运费
						"appid": this.$DEVELOPER.szblid,
						"rpflag": this.$DEVELOPER.cid,
						// "jsondata": this.get_pay_data.jsondata, //规格id,数量,活动id
						"address": this.waimai ? this.show_msg.prov + this.show_msg.city + this.show_msg.area + this.show_msg.address :
							'', //收货地址
						// "querykeyword": this.get_pay_data.name + ',' + this.get_pay_data.name, //快速搜索
						"querykeyword": this.get_pay_data.kw0, //快速搜索
						"unit": this.get_pay_data.unit, //商店id
					}];
					// };

					// let strOrder = JSON.stringify(order_msg)
					let strOrder = this.$base.jsonResToStr(order_msg)
					// console.log(order_msg);
					// return

					this.$base.szblPost('/api/sciorder?m=' + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" + this.$base
						.getState(),
						strOrder).then(res => {
						if (res.data === null) {
							uni.showToast({
								icon: 'none',
								title: res.msg,
								duration: 1000,
								mask: false
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
							// #endif
							// #ifdef APP-PLUS
							this.payUp(this.order_num);
							// #endif

						}


					}).catch((err) => {
						// console.log(3)

						console.log(err);
						return;
					})
				}
			}
		},
	}
</script>

<style>

</style>
