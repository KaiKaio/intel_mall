<template>
	<!-- 订单详情页 -->
	<view>
		<view class="order-detail">
			<view class="od-top">
				
				<view v-if="detail.status==0">
					<span>待付款</span>
					<text class="font-icon">&#xe626;</text>
				</view>
				
				<view v-if="detail.status==1">
					<span>待发货</span>
					
					<text class="font-icon">&#xe868;</text>
				</view>
				
				<view v-if="detail.status==2">
					<span>待收货</span>
					<text class="font-icon">&#xe61c;</text>
					
					
				</view>
				
				<view v-if="detail.status==3">
					<span>待评价</span>
					<text class="font-icon">&#xe66a;</text>
				</view>
				
				<view v-if="detail.status==4">
					<span>交易成功</span>
					<text class="font-icon">&#xe629;</text>
				</view>


				<view v-if="detail.status==5">
					<span>交易关闭</span>
					<text class="font-icon">&#xe66b;</text>
					
				</view>
				
			</view>
			
			<view class="step-procces">
				<view class="step-point">
					<text class="point" :style="detail.status > -1  ? { backgroundColor: '#EB544D' } : { backgroundColor: '#ccc' }"></text>
					<text :style="detail.status > -1  ? { color: '#EB544D' } : { color: '#666' }">订单已提交</text>
				</view>
				<view class="step-point">
					<text class="point" :style="detail.status > 0 ? { backgroundColor: '#EB544D' } : { backgroundColor: '#ccc' }"></text>
					<text :style="detail.status > 0  ? { color: '#EB544D' } : { color: '#666' }">支付成功</text>
				</view>
				<view class="step-point">
					<text class="point" :style="detail.status > 1 ? { backgroundColor: '#EB544D' } : { backgroundColor: '#ccc' }"></text>
					<text :style="detail.status > 1  ? { color: '#EB544D' } : { color: '#666' }">正在配送商品</text>
				</view>
				<view class="step-point">
					<text class="point" :style="detail.status == 4 ? { backgroundColor: '#EB544D' } : { backgroundColor: '#ccc' }"></text>
					<text :style="detail.status == 4 ? { color: '#EB544D' } : { color: '#666' }">订单已完成</text>
				</view>
				
				
				<view class="step-line">
					<view 
						:style="{width: proccess}"
						style="
						height: 2px;
						background-color: #EB544D;
					"></view>
				</view>
			</view>

			<!-- 商品开始 -->
			<view>
				
				<view class="od-middle">
					<view class="od-icon">
						<text class="font-icon">&#xe699;</text>
					</view>
					<view class="od-address">
						<view style="font-size: 25upx;">
							<p style="display: flex;"><text style="width: 140upx; text-align: right;">收货地址：</text>{{detail.address}}</p>
							<p style="display: flex;"><text style="width: 140upx; text-align: right;">联系方式：</text>{{shdh}}</p>
							<p style="display: flex;"><text style="width: 140upx; text-align: right;">收货人：</text>{{shr}}</p>
						</view>
					</view>
				</view>
				
				<view class="od-bottom">
					<view class="od-bt-detail" v-for="(gItem, gIndex) in splb" :key="gIndex">
						<view class="img">
							<image :src="$base.urlPrex + gItem.photo" mode="'aspectFit'"></image>
						</view>
						<view class="detail">
							<p>商品名称：{{gItem.name}}</p>
							<p>规格：{{gItem.kw0}}</p>
							<p>数量：x{{gItem.kw1}}</p>
							<p class="detail-price">
								<span>¥{{gItem.kw2}}</span>
							</p>
						</view>
					</view>
					<view class="od-bt-price" style="border-bottom: 0upx;">
						<ul>
							<li>
								<span>商品总价</span>
								<span>¥{{ (detail.kw4 - detail.kw9).toFixed(2) }}</span>
							</li>
							<li>
								<span>运费</span>
								<span>¥{{detail.kw9}}</span>
							</li>
							<li>
								<span>订单总价</span>
								<span>¥{{detail.kw4}}</span>
							</li>
							<li>
								<span>实付款</span>
								<span>¥{{detail.kw4}}</span>
							</li>
						</ul>
					</view>
					<!-- <view class="od-bt-button">
						<ul>
							<li v-if="detail.status==0" class="od-cancel" @click="cancel">取消订单</li>
							<li v-if="detail.status==0" class="od-pay" @click="goPay">立即付款</li>
							<li v-if="detail.status==1 || detail.status==4" class="od-pay" @click="sqRefund">申请退款</li>
							<li v-if="detail.status==6" class="od-pay" @click="comment">立即评价</li>
							<li v-if="detail.status==5" class="od-pay" @click="confirm">确认收货</li>
						</ul>
					</view> -->
				</view>
			</view>
		</view>
		<!-- 商品结束 -->

		<view class="od-info">
			<view class="od-info-title">
				<span class="color-hdsh">▍</span>订单信息
			</view>
			<view class="od-info-detail">
				<ul>
					<li>
						<span>订单号：</span>
						<span>{{detail.id}}</span>
					</li>
					<li v-if="sort != 9">
						<span>付款方式：</span>
						<span>{{fkfs}}</span>
					</li>
					<li>
						<span>创建时间：</span>
						<span>{{detail.createtime}}</span>
					</li>
				</ul>
			</view>
		</view>
		
		<view class="od-info" v-if="detail.status == 2 || detail.status == 4">
			<view class="od-info-title">
				<span class="color-hdsh">▍</span>配送信息
			</view>
			<view class="od-info-detail">
				<ul>
					<li>
						<span>配送员电话：</span>
						<span>{{psydh}}</span>
					</li>
					<li>
						<span>配送员姓名：</span>
						<span>{{psyxm}}</span>
					</li>
				</ul>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {},
				default_img: require('@/static/icon/default.png'),
				goodsPrice: 0, //商品总价
				sort: '', //分类：1-民宿，2-美食，3-商品，4-票务，5-爱心消费，6-线下活动，7-套票，8-剧场（电影）票，9-剧场（电影）赠票
				days: 0, //预定民宿的天数
				styleList: [], //规格列表，美食用
				num: [], //存某规格购买的数量，美食用,
				splb: [],
				fkfs: '',
				psyxm: '',
				psydh: '',
				shdh: '',
				shr: '',
			};
		},
		
		computed: {
			proccess: function() {
				if(this.detail.status === 0) {
					return '0%'
				} else if(this.detail.status === 1) {
					return '32%'
				} else if(this.detail.status === 2) {
					return '64%'
				} else if(this.detail.status === 4) {
					return '100%'
				}
			}
		},
		
		onLoad(obj) {
			this.sort = parseInt(obj.g)
			this.getDetail(obj.id, obj.status)
		},
		methods: {
			getDetail(id, status) {
				this.$base.szblGet('/api/orders/' + id, {
					m: this.$userMsg.userid,
					tk: this.$userMsg.token,
					state: this.$base.getState()
				}).then(res => {
					
					let r = this.$base.strResToJson(res.data)
					this.detail = r
					this.splb = this.detail.jsondata.splb
					this.fkfs = this.detail.jsondata.fkfs
					this.psydh = this.detail.jsondata.psydh
					this.psyxm = this.detail.jsondata.psyxm
					this.shdh = this.detail.jsondata.shdh
					this.shr = this.detail.jsondata.shr
				}).catch(err => {
					console.log(err)
				});
			},
			//计算天数差的函数，通用
			DateDiff(sDate1, sDate2) { //sDate1和sDate2是2002-12-18格式  
				var aDate, oDate1, oDate2, iDays
				aDate = sDate1.split("-")
				oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2002格式  
				aDate = sDate2.split("-")
				oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
				iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数  
				this.days = iDays
			},
			// 支付
			goPay() {
				let obj = {
					phones: this.detail.kw1,
					cn_1: this.detail.name,
					cn_2: "新加",
					cn_3: "",
					order_id: this.detail.id
				}
				if(this.sort == 1){
					obj.cn_2 = "民宿的新"
					obj.cn_3 = "请在半小时内在后台确认是否接受订单,逾期将自动失效."
				}else if(this.sort == 2){
					if (this.detail.kw17 == true) {
						obj.cn_3 = this.detail.kw6 + "下单了一份外卖订单，请尽快送至 ' " + this.detail.address + " '，联系电话：" + this.detail.kw7;
					} else {
						obj.cn_3 = this.detail.kw6 + "下单了一份美食订单，联系电话：" + this.detail.kw7;
					}
				}else if(this.sort == 3){
					obj.cn_3 = this.detail.kw6 + "购买了" + this.detail.jsondata.length + "件商品"
				}else if(this.sort == 4 || this.sort == 8 || this.sort == 9){
					obj.cn_3 = this.detail.kw6 + "购买了" + this.detail.kw0.replace(/【/g, " ").replace(/】/g, " ")
				}else if(this.sort == 7){
					// obj.cn_1 = "清溪商城"
					obj.cn_1 = this.$DEVELOPER.name
					obj.cn_2 = "套票"
					obj.cn_3 = this.detail.kw6 + "购买了" + this.detail.kw0.replace(/【/g, " ").replace(/】/g, " ")
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
				if (this.detail.kw8 == '微信') {
					if (this.$TERMINAL.m == 'nmy') {
						let mark = this.$DEVELOPER.nmyPayMarkApp
						this.$base.szblGet("/api/wechatpayApp/" + this.detail.kw2, {
							wxsid: mark,
							u: this.$userMsg.userid,
							tk: this.$userMsg.token,
							state: this.$base.getState()
						}).then(dataJson => {
							this.$PAYSUCCMSG.length = 0
							this.$PAYSUCCMSG.push(obj)
							if (this.$TERMINAL.os == 'i') {
								window.webkit.messageHandlers.iosWechatPay.postMessage({
									body: JSON.parse(dataJson.data)
								});
							} else if (this.$TERMINAL.os == 'a') {
								window.android.androidWechatPay(dataJson.data)
							}
						}).catch(msg => {
							console.log(msg);
						})
					} else {
						this.$base.getWxPay(this.$userMsg.userid, this.$userMsg.token, this.detail.kw2, this.$DEVELOPER.wxPayMarkPUBLIC,
							uni.getStorageSync("wxOpenid")).then(res => {
							//支付成功
							if (res == "ok") {
								this.paySuccess(obj);
							}
						}).catch(msg => {
							alert(msg);
						});
					}
				} else {
					// uni.showToast({
					// 	icon: 'none',
					// 	mask: false,
					// 	title: '请在“海岛生活”APP内进行付款',
					// 	duration: 1000
					// })
				}
				// #endif

				// #ifdef APP-PLUS
				uni.showToast({
					title: '',
					icon: 'loading',
					mask: true,
					duration: 50000,
				});
				if (this.detail.kw8 == '微信') {
					this.$base.szblGet("/api/wechatpayApp/" + this.detail.kw2, {
						wxsid: this.$DEVELOPER.wxPayMarkAPP,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then(dataJson => {
						// console.log(dataJson.data)
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: dataJson.data, //微信、支付宝订单数据
							success: res => {
								// console.log('success:' + JSON.stringify(res));
								this.paySuccess(obj);
								uni.hideToast();
								uni.showToast({
									title: '订单支付成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
								this.detail.status = 1;
							},
							fail: err => {
								// console.log('fail:' + JSON.stringify(err));
								uni.hideToast();
								uni.showToast({
									title: '订单支付失败',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							}
						});
					}).catch(msg => {
						console.log(msg);
						uni.hideToast();
					})
				} else if (this.detail.kw8 == '支付宝') {
					this.$base.szblGet("/api/alipayApp/" + this.detail.kw2, {
						alisid: this.$DEVELOPER.aliPayMark,
						u: this.$userMsg.userid,
						tk: this.$userMsg.token,
						state: this.$base.getState()
					}).then(dataJson => {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: dataJson.data, //微信、支付宝订单数据
							success: res => {
								// console.log('success:' + JSON.stringify(res));
								this.paySuccess(obj);
								uni.hideToast();
								uni.showToast({
									title: '订单支付成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
								this.detail.status = 1;
							},
							fail: err => {
								// console.log('fail:' + JSON.stringify(err));
								uni.hideToast();
								uni.showToast({
									title: '订单支付失败',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							}
						});
					}).catch(msg => {
						console.log(msg);
					})
				}
				// #endif

				// #ifdef MP-WEIXIN
				this.$base.getWxxcxPay(this.$userMsg.userid, this.$userMsg.token, this.detail.kw2, this.$DEVELOPER.wxPayMarkXCX,
					uni.getStorageSync("wxXCXOpenid")).then(res => {
					// console.log(res)
					uni.requestPayment({
						provider: "wxpay",
						timeStamp: res.timeStamp.toString(),
						nonceStr: res.nonceStr,
						package: res.package,
						signType: res.signType,
						paySign: res.paySign,
						success: resData => {
							this.paySuccess(obj);
							uni.hideToast();
							uni.showToast({
								title: '订单支付成功',
								icon: 'none',
								mask: false,
								duration: 1000
							});
							this.detail.status = 1;
						}
					})
				}).catch(msg => {
					console.log(msg)
				})
				// #endif
			},
			// 支付成功后通知商家、增加销量的方法
			paySuccess(obj) {
				this.$base.szblPut("/api/sciorder/sales/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token +
					"&state=" + this.$base.getState()).then(dataJson => {
					//付款后通知商家
					this.$base.szblPost("/api/sms/notice?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
						this.$base.getState(), {
							"phones": obj.phones,
							"smsid": "1566462939231915455699",
							"appid": this.$DEVELOPER.szblid,
							"cn_1": obj.cn_1,
							"cn_2": obj.cn_2,
							"cn_3": obj.cn_3,
							"cn_4": this.detail.id
						}).then(res => {
						this.detail.status = 4
						if(this.sort == 7){
							this.detail.list.forEach(item => {
								item.status = 0
							})
						}
					}).catch(msg => {
						console.log(msg);
					})
				}).catch(msg => {
					console.log(msg)
					uni.hideToast();
					return;
				})
			},
			// 商品、套票用的申请退款方法
			sqRefund() {
				let msg_obj = {
					"phones": this.detail.kw1,
					"smsid": "1566462939231915455699",
					"appid": this.$DEVELOPER.szblid,
					"cn_1": this.detail.name,
					"cn_2": this.detail.gid == 3 ? "退款" : "套票退款",
					"cn_3": '',
					"cn_4": this.detail.id
				}
				if(this.detail.gid == 3){
					msg_obj.cn_3 = this.detail.kw6 + "要求退" + (this.detail.jsondata.length == 1 ? this.detail.jsondata[0].spuname.replace(/【/g, " ").replace(/】/g, " ") : "多款商品")
				}else if(this.detail.gid == 7){
					msg_obj.cn_3 = this.detail.kw6 + "要求退" + this.detail.kw0.replace(/【/g, " ").replace(/】/g, " ")
				}
				uni.showModal({
					title: '您确定要申请退款吗？',
					content: ' ',
					confirmColor: this.$PROP.hdsh_color,
					showCancel: true,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut("/api/sciorder/tuikuan/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" +
								this.$userMsg
								.token + "&state=" + this.$base.getState()).then(dataJson => {
								uni.showToast({
									icon: 'none',
									title: '申请退款成功，待商家同意',
									mask: false,
									duration: 1000
								})
								this.detail.status = 8

								//退款后通知商家
								this.$base.szblPost("/api/sms/notice?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg.token + "&state=" +
									this.$base.getState(), msg_obj).then(res2 => {}).catch(msg => {
									console.log(msg);
								})

							}).catch(msg => {
								console.log(msg)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			// 民宿订单退订用
			unSubscribe() {
				let content = '您确定要退订吗？'
				let date = new Date()
				date.setTime(date.getTime());
				let s1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				let cal = this.$base.dateCal(s1, this.detail.stime)
				let days = this.$base.dateCal(this.detail.stime, this.detail.etime) //总共订了多少天
				let roomAmount = parseInt(this.detail.kw5) //房间数
				let amount = parseFloat(this.detail.kw4) //总金额
				let money = amount / days //首夜房费
				let halfMoney = money * 0.5 //首夜房费的一半
				let isAll = false //是否扣了全部的钱
				if (cal < 0) {
					uni.showToast({
						icon: 'none',
						title: '已超过入住时间的第一天，请联系店家退款',
						mask: false,
						duration: 1000
					})
					return
				} else if (this.detail.kw13 == "1" || this.detail.status == 4) {
					content = "您现在可以免手续费退订，确定要退订吗？"
				} else if (this.detail.kw13 == "0" && this.detail.status != 4) {
					if (cal == 0) {
						isAll = amount == money.toFixed(2) ? true : false
						content = "您现在退订将要收取第一晚房费的100%做手续费（约" + money.toFixed(2) + "元），确定要退订吗？"
					} else if (cal == 1) {
						isAll = amount == halfMoney.toFixed(2) ? true : false
						content = "您现在退订将要收取第一晚房费的50%做手续费（约" + halfMoney.toFixed(2) + "元），确定要退订吗？"
					} else if (cal > 1) {
						content = "您现在可以免手续费退订，确定要退订吗？"
					}
				}
				uni.showModal({
					content: content,
					showCancel: true,
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut("/api/sciorder/tuikuan/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" +
								this.$userMsg
								.token + "&state=" + this.$base.getState()).then(dataJson1 => {
								if (!isAll || x.status == 4) {
									if (this.detail.kw8 == '微信') {
										this.$base.wxPayRefund(this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.wxPayMarkPUBLIC,
												this.detail.kw2)
											.then(succ => {
												this.detail.status = 2
												uni.showToast({
													icon: 'none',
													title: '退订成功',
													mask: false,
													duration: 1000
												})
											}).catch(msg => {
												uni.showToast({
													icon: 'none',
													title: '微信退款失败，请联系平台管理员',
													mask: false,
													duration: 1000
												})
											})
									} else if (this.detail.kw8 == '支付宝') {
										this.$base.aliPayRefund(this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.aliPayMark, x
											.kw2).then(succ => {
											this.detail.status = 2
											uni.showToast({
												icon: 'none',
												title: '退订成功',
												mask: false,
												duration: 1000
											})
										}).catch(msg => {
											uni.showToast({
												icon: 'none',
												title: '支付宝退款失败，请联系平台管理员',
												mask: false,
												duration: 1000
											})
										})
									}
								} else {
									this.detail.status = 2
								}
							}).catch(msg => {
								console.log(msg)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			// 美食、门票用的退款方法
			refund() {
				uni.showModal({
					title: '您确定要退款吗？',
					content: ' ',
					confirmColor: this.$PROP.hdsh_color,
					showCancel: true,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut("/api/sciorder/tuikuan/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" +
								this.$userMsg
								.token + "&state=" + this.$base.getState()).then(tkRes => {
			
								if (this.detail.kw8 == '微信') {
									this.$base.wxPayRefund(this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.wxPayMarkPUBLIC, this.detail
											.kw2)
										.then(refundRes => {
											uni.showToast({
												icon: 'none',
												title: '退款成功',
												mask: false,
												duration: 1000
											})
											this.detail.status = 2
										}).catch(refundMsg => {
											uni.showToast({
												icon: 'none',
												title: '微信退款失败，请联系平台管理员',
												mask: false,
												duration: 1000
											})
											this.reStatus()
										})
								} else if (this.detail.kw8 == '支付宝') {
									this.$base.aliPayRefund(this.$userMsg.userid, this.$userMsg.token, this.$DEVELOPER.aliPayMark, this.detail
										.kw2).then(refundRes => {
										uni.showToast({
											icon: 'none',
											title: '退款成功',
											mask: false,
											duration: 1000
										})
										this.detail.status = 2
									}).catch(refundMsg => {
										uni.showToast({
											icon: 'none',
											title: '支付宝退款失败，请联系平台管理员',
											mask: false,
											duration: 1000
										})
										this.reStatus()
									})
								}
							}).catch(msg => {
								console.log(msg)
							})
						}
						if (res.cancel) {
							return
						}
					}
				})
			},
			// 取消订单
			cancel() {
				uni.showModal({
					title: '您确定要取消该订单吗？',
					content: ' ',
					showCancel: true,
					cancelText: '不',
					confirmText: '确定',
					confirmColor: this.$PROP.hdsh_color,
					success: res => {
						// console.log(res)
						if (res.confirm) {
							this.$base.szblDel('/api/sciorder/' + this.detail.id + '?m=' + this.$userMsg.userid + '&tk=' + this.$userMsg
								.token +
								'&state=' +
								this.$base.getState()).then(res => {
								this.detail.status = 3;
								uni.showToast({
									title: '取消成功',
									icon: 'none',
									mask: false,
									duration: 1000
								});
							}).catch(msg => {
								uni.showToast({
									title: '取消失败',
									icon: 'none',
									mask: false,
									duration: 1000
								});
								return
							});
						} else if (res.cancel) {
							return
						}

					},
				});
			},
			// 确认收货（民宿不用）
			confirm() {
				uni.showModal({
					title: '您确认收货吗？(确认收货,订单完成交易)',
					content: ' ',
					confirmColor: this.$PROP.hdsh_color,
					showCancel: true,
					success: res => {
						if (res.confirm) {
							this.$base.szblPut("/api/sciorder/shouhuo/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" +
								this.$userMsg
								.token + "&state=" + this.$base.getState()).then(res => {
								this.detail.status = 6
								uni.showToast({
									icon: 'none',
									title: '确认收货成功',
									mask: false,
									duration: 1000
								})
							}).catch(msg => {
								console.log(msg)
							})
						}
						if (res.cancel) {
							return
						}
					},
				});
			},
			// 评价
			comment() {
				this.$store.commit('set_comment_data', this.detail)
				uni.navigateTo({
					url: '/pages/component/comment/comment',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
				// uni.navigateTo({
				// 	url: '/pages/component/comment/comment?i=' + this.detail.id + '&n=' + this.detail.name + '&u=' + this.detail.unit +
				// 		'&c=' +
				// 		this.detail.cid + '&s=' + this.detail.gid,
				// });
			},
			//美食、门票退款失败后回退订单状态
			reStatus() {
				this.$base.szblPut("/api/sciorder/restatus/" + this.detail.id + "?m=" + this.$userMsg.userid + "&tk=" + this.$userMsg
					.token + "&state=" + this.$base.getState()).then(res => {
					// todo 需要返回回退后的状态
				}).catch(msg => {
					uni.showToast({
						icon: "none",
						mask: false,
						title: msg
					})
					console.log(msg);
				})
			}
		}
	}
</script>

<style style="scss">
	.step-procces {
		position: relative;
		display: flex;
		font-size: 24upx;
		justify-content: space-between;
		padding: 16upx 20upx;
		background-color: #fff;
		margin-top: 14upx;
		margin-bottom: 14upx;
	}
	
	.step-procces > .step-point {
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 1;
	}
	
	.step-procces > .step-line {
		position: absolute;
		top: 22upx;
		width: calc(100% - 162upx);
		height: 4upx;
		background-color: #ccc;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.step-procces > .step-point > .point {
		background-color: #ccc;
		border-radius: 50%;
		color: #555;
		width: 16upx;
		height: 16upx;
		margin-bottom: 20upx;
	}
	
	.ew {
		text-align: center;
		display: block;
	}

	.ew img {
		width: 50%;
	}

	.ew p {
		padding: 20upx 0;
	}

	.od-bt-detail .img {
		border-radius: 0;
	}

	.od-package-detail {
		width: 100%;
		padding: 10px 5px;
		border-bottom: 1px solid #eee;
	}

	.od-package-detail .img {
		overflow: hidden;
		max-height: 100%;
		width: 100px;
		height: 100px;
		flex-shrink: 0;
	}

	.od-package-detail .item {
		display: flex;
		margin-bottom: 20upx;
	}

	.od-package-detail .item:last-child {
		margin-bottom: 0;
	}

	.od-package-detail .item .detail {
		margin-left: 10upx;
		/* display: flex;
		flex-direction: column;
		justify-content: center; */
		position: relative;
		width: 100%;
	}

	.od-package-detail .item .detail view:nth-child(2) {
		font-size: 24upx;
	}

	.od-package-detail .item .detail .status-wrap {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
		justify-content: space-between;
	}

	.od-package-detail .img image {
		width: 100%;
		height: 100%;

	}

	.od-package-top {
		width: 100%;
		font-size: 16px;
		color: #fff;
		/* background: -webkit-gradient(linear, left top, right top, from(#7bbfea), to(#84dadb)); */
	}

	.od-qrcode {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px 0;
	}

	.od-qrcode image {
		height: 480upx;
		width: 480upx;
	}
</style>
